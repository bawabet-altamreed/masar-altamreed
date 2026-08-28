import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
sendPasswordResetEmail,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
setDoc,
getDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
auth,
db
} from "./config.js";

/* ================================
Google Provider
================================ */

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
prompt: "select_account"
});

/* ================================
إنشاء حساب بالبريد
================================ */

async function registerWithEmail(
email,
password,
userData
) {

const userCredential =
    await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

const user =
    userCredential.user;


await setDoc(
    doc(db, "users", user.uid),
    {

        uid: user.uid,

        name: userData.name,

        email: user.email,

        stage: userData.stage,

        role: "student",

        accountStatus: "pending",

        subscriptionStatus: "none",

        createdAt: serverTimestamp(),

        provider: "password"

    }
);


return user;

}

/* ================================
تسجيل الدخول بالبريد
================================ */

async function loginWithEmail(
email,
password
) {

const userCredential =
    await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

return userCredential.user;

}

/* ================================
تسجيل الدخول / التسجيل Google
================================ */

async function loginWithGoogle(
stage = ""
) {

const result =
    await signInWithPopup(
        auth,
        googleProvider
    );

const user =
    result.user;


const userRef =
    doc(db, "users", user.uid);


const userSnapshot =
    await getDoc(userRef);


if (!userSnapshot.exists()) {

    await setDoc(
        userRef,
        {

            uid: user.uid,

            name: user.displayName || "",

            email: user.email || "",

            stage: stage,

            role: "student",

            accountStatus: "pending",

            subscriptionStatus: "none",

            createdAt: serverTimestamp(),

            provider: "google"

        }
    );

}


return user;

}

/* ================================
استعادة كلمة المرور
================================ */

async function resetPassword(
email
) {

await sendPasswordResetEmail(
    auth,
    email
);

}

/* ================================
تسجيل الخروج
================================ */

async function logout() {

await signOut(auth);

}

/* ================================
متابعة حالة تسجيل الدخول
================================ */

function watchAuthState(
callback
) {

return onAuthStateChanged(
    auth,
    callback
);

}

/* ================================
حفظ المرحلة لحساب Google
================================ */

async function saveGoogleStage(
uid,
stage
) {

if (!uid) {

    throw new Error(
        "User ID is required."
    );

}


if (!stage) {

    throw new Error(
        "Stage is required."
    );

}


await setDoc(
    doc(db, "users", uid),
    {

        stage: stage,

        role: "student",

        accountStatus: "pending",

        subscriptionStatus: "none",

        provider: "google"

    },
    {
        merge: true
    }
);

}

/* ================================
تصدير الوظيفة
================================ */

export {
registerWithEmail,
loginWithEmail,
loginWithGoogle,
saveGoogleStage,
resetPassword,
logout,
watchAuthState
};

