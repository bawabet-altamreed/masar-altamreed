const {onCall,HttpsError}=require("firebase-functions/v2/https");
const admin=require("firebase-admin");
const crypto=require("crypto");
admin.initializeApp();
const db=admin.firestore(), auth=admin.auth();
const users=db.collection("users");

// IMPORTANT: Hashing passwords here is for subscription-code login validation.
// Firebase Auth itself receives ONLY a short-lived custom token, not the password.
const hash=(password,salt)=>crypto.scryptSync(password,salt,64).toString("hex");
const valid=async(code,password)=>{
 const q=await users.where("subscriptionCode","==",code).limit(1).get();
 if(q.empty) throw new HttpsError("unauthenticated","بيانات الدخول غير صحيحة");
 const d=q.docs[0], x=d.data();
 if(!x.passwordHash || !x.passwordSalt || !crypto.timingSafeEqual(Buffer.from(x.passwordHash,"hex"),Buffer.from(hash(password,x.passwordSalt),"hex")))
   throw new HttpsError("unauthenticated","بيانات الدخول غير صحيحة");
 if(x.accountStatus!=="active" || x.subscriptionStatus!=="active" || x.subscriptionEnd.toDate()<new Date())
   throw new HttpsError("permission-denied","الحساب أو الاشتراك غير فعال");
 return {id:d.id,...x};
};
exports.loginWithSubscriptionCode=onCall(async req=>{
 const {code,password}=req.data||{};
 if(typeof code!=="string"||typeof password!=="string") throw new HttpsError("invalid-argument","بيانات غير مكتملة");
 const u=await valid(code.trim(),password);
 const token=await auth.createCustomToken(u.id,{role:u.role});
 return {token,redirect:u.role==="student"?"/student/dashboard.html":u.role==="teacher"?"/teacher/dashboard.html":"/admin/dashboard.html"};
});
async function requireAdmin(req){
 if(!req.auth) throw new HttpsError("unauthenticated","يجب تسجيل الدخول");
 const s=await users.doc(req.auth.uid).get();
 if(!s.exists||s.data().role!=="admin") throw new HttpsError("permission-denied","غير مصرح");
}
exports.createStudent=onCall(async req=>{
 await requireAdmin(req);
 const {name,stage,code,password,endDate}=req.data||{};
 if(!name||!stage||!code||!password||!endDate) throw new HttpsError("invalid-argument","بيانات ناقصة");
 const exists=await users.where("subscriptionCode","==",String(code).trim()).limit(1).get();
 if(!exists.empty) throw new HttpsError("already-exists","كود الاشتراك مستخدم");
 const uid=crypto.randomUUID(), salt=crypto.randomBytes(16).toString("hex");
 const start=admin.firestore.Timestamp.now(), end=admin.firestore.Timestamp.fromDate(new Date(endDate+"T23:59:59"));
 await users.doc(uid).set({
   name:String(name), stage:String(stage), subscriptionCode:String(code).trim(),
   passwordSalt:salt,passwordHash:hash(String(password),salt),
   role:"student",accountStatus:"active",subscriptionStatus:"active",
   subscriptionStart:start,subscriptionEnd:end,createdAt:admin.firestore.FieldValue.serverTimestamp()
 });
 return {ok:true,uid};
});
// Admin-only callable endpoints should handle renew/suspend/changePassword/createTeacher.
// Keep password hashes exclusively server-side and never expose them to clients.
