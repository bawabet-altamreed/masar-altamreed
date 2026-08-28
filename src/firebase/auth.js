import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";

import { app } from "./config.js";

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});


export async function registerUser(email, password, displayName) {

    const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    const user = userCredential.user;

    if (displayName) {

        await updateProfile(user, {
            displayName: displayName
        });

    }

    return user;
}


export async function loginUser(email, password) {

    const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    return userCredential.user;
}


export async function loginWithGoogle() {

    const userCredential =
        await signInWithPopup(
            auth,
            googleProvider
        );

    return userCredential.user;
}


export async function logoutUser() {

    await signOut(auth);

}


export function observeAuth(callback) {

    return onAuthStateChanged(
        auth,
        callback
    );

}


export { auth };
