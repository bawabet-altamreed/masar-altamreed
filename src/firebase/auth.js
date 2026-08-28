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
    updateDoc,
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
   إنشاء حساب باستخدام Email
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
       users/{uid}
    ===================================== */

    await setDoc(
        doc(db, "users", user.uid),
        {

            uid:
                user.uid,

            name:
                userData.name ||
                user.displayName ||
                "",

            email:
                user.email ||
                "",

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
   تسجيل الدخول باستخدام Email
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
   تسجيل الدخول / التسجيل باستخدام Google
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
       users/{uid}
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
   حفظ المرحلة بعد أول تسجيل Google
========================================= */

export async function saveGoogleStage(
    uid,
    stage
) {

    if (!uid) {

        throw new Error(
            "User UID is required."
        );

    }


    if (!stage) {

        throw new Error(
            "Stage is required."
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


    /* =====================================
       التأكد أن الحساب موجود
    ===================================== */

    if (!userSnapshot.exists()) {

        throw new Error(
            "User profile not found."
        );

    }


    const currentData =
        userSnapshot.data();


    /* =====================================
       لا نغير حالة الموافقة
       ولا الاشتراك
    ===================================== */

    await updateDoc(
        userRef,
        {

            stage:
                stage,

            updatedAt:
                serverTimestamp()

        }
    );


    return true;
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

    if (!email) {

        throw new Error(
            "Email is required."
        );

    }


    return await sendPasswordResetEmail(
        auth,
        email
    );
}
