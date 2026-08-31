import { call } from "../firebase/functions.js";
import { signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "../firebase/firebase.js";
const f=document.querySelector("#loginForm"), msg=document.querySelector("#msg");
f.addEventListener("submit",async e=>{e.preventDefault();msg.textContent="جارٍ التحقق...";
try{
 const code=document.querySelector("#code").value.trim(), password=document.querySelector("#password").value;
 const r=await call("loginWithSubscriptionCode",{code,password});
 await signInWithCustomToken(auth,r.data.token);
 location.replace(r.data.redirect);
}catch(err){msg.textContent=err.message||"تعذر تسجيل الدخول";}});