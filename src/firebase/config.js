import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyBeNJcnfrPVA1uncQI0rN_YAPjF16o6aCs",

authDomain: "masar-altamreed.firebaseapp.com",

projectId: "masar-altamreed",

storageBucket: "masar-altamreed.firebasestorage.app",

messagingSenderId: "728754667780",

appId: "1:728754667780:web:7f47681e7aa5488a645051",

measurementId: "G-FHM351MLZB"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export {
app,
auth,
db
};
