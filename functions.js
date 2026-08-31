import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";
import { app } from "./firebase.js";
export const functions = getFunctions(app);
export const call = (name, data) => httpsCallable(functions, name)(data);