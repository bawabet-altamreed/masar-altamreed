import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

import { app } from "./config.js";

const db = getFirestore(app);

export async function createUserProfile(uid, data) {
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, {
        ...data,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

export async function getUserProfile(uid) {
    const userRef = doc(db, "users", uid);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

export async function updateUserProfile(uid, data) {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export { db };
