import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signInWithPopup,
GoogleAuthProvider,
sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
auth,
db
} from "./config.js";

/* =========================================
Google Provider
========================================= */

const googleProvider =
new GoogleAuthProvider();

/* =========================================
إنشاء حساب Email
========================================= */

export async function registerWithEmail(
email,
password,
userData = {}
) {

const credential =
    await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );


const user =
    credential.user;


/* =====================================
   إنشاء users/{uid}
===================================== */

await setDoc(
    doc(db, "users", user.uid),
    {

        uid: user.uid,

        name:
            userData.name ||
            user.displayName ||
            "",

        email:
            user.email || "",

        stage:
            userData.stage ||
            "",

        role:
            "student",

        accountStatus:
            "pending",

        subscriptionStatus:
            "none",

        subscriptionStart:
            null,

        subscriptionEnd:
            null,

        createdAt:
            serverTimestamp(),

        updatedAt:
            serverTimestamp()

    }
);


return user;

}

/* =========================================
تسجيل الدخول Email
========================================= */

export async function loginWithEmail(
email,
password
) {

const credential =
    await signInWithEmailAndPassword(
        auth,
        email,
        password
    );


return credential.user;

}

/* =========================================
تسجيل الدخول / التسجيل Google
========================================= */

export async function loginWithGoogle() {

const credential =
    await signInWithPopup(
        auth,
        googleProvider
    );


const user =
    credential.user;


/* =====================================
   التأكد هل users/{uid} موجودة
===================================== */

const userRef =
    doc(
        db,
        "users",
        user.uid
    );


const userSnapshot =
    await getDoc(userRef);


/* =====================================
   أول تسجيل Google
===================================== */

if (!userSnapshot.exists()) {

    await setDoc(
        userRef,
        {

            uid:
                user.uid,

            name:
                user.displayName ||
                "",

            email:
                user.email ||
                "",

            stage:
                "",

            role:
                "student",

            accountStatus:
                "pending",

            subscriptionStatus:
                "none",

            subscriptionStart:
                null,

            subscriptionEnd:
                null,

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()

        }
    );

}


return user;

}

/* =========================================
جلب بيانات المستخدم
users/{uid}
========================================= */

export async function getUserProfile(
uid
) {

if (!uid) {

    throw new Error(
        "User UID is required."
    );

}


const userRef =
    doc(
        db,
        "users",
        uid
    );


const userSnapshot =
    await getDoc(userRef);


if (!userSnapshot.exists()) {

    return null;

}


return {

    id:
        userSnapshot.id,

    ...userSnapshot.data()

};

}

/* =========================================
إعادة تعيين كلمة المرور
========================================= */

export async function resetPassword(
email
) {

return await sendPasswordResetEmail(
    auth,
    email
);

}
