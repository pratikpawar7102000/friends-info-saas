// ✅ Replace with your real config
const firebaseConfig = {
  apiKey: "AIzaSyCRIrXGOP2PUDahs9vFUUxElcZGSuCLGQU",
  authDomain: "friendsformproject.firebaseapp.com",
  projectId: "friendsformproject",
  storageBucket: "friendsformproject.firebasestorage.app",
  messagingSenderId: "932563171087",
  appId: "1:932563171087:web:a414900bd719a12e0d707a",
  measurementId: "G-KGH3062W2K"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Sections
const friendsSection = document.getElementById("friendsSection");
const authSection = document.getElementById("authSection");

// ✅ Buttons & Inputs
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailInput = document.getElementById("userEmail");
const userPasswordInput = document.getElementById("userPassword");
const userProfile = document.getElementById("userProfile");

const friendsForm = document.getElementById("friendsForm");
const friendsList = document.getElementById("friendsList");

// ✅ SIGN UP
signUpBtn.addEventListener("click", () => {
  const email = userEmailInput.value;
  const password = userPasswordInput.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Sign Up Successful!");
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
});

// ✅ LOG IN
loginBtn.addEventListener("click", () => {
  const email = userEmailInput.value;
  const password = userPasswordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Log In Successful!");
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
});

// ✅ LOG OUT
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("Logged Out!");
  });
});

// ✅ Submit Friends Form
friendsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const friendEmail = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;

    db.collection("users").doc(uid).collection("friends").add({
      name: name,
      email: friendEmail,
      phone: phone,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert("Friend info saved!");
      friendsForm.reset();
      loadFriends(uid); // ✅ Reload list
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });

  } else {
    alert("Please log in first.");
  }
});

// ✅ Show/hide sections + load profile + friends list
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Logged in:", user.email);
    friendsSection.style.display = "block";
    authSection.style.display = "none";

    userProfile.innerText = `Logged in as: ${user.email}`;

    loadFriends(user.uid);

  } else {
    console.log("Not logged in");
    friendsSection.style.display = "none";
    authSection.style.display = "block";
  }
});

// ✅ Load friends list
function loadFriends(uid) {
  friendsList.innerHTML = ""; // Clear old

  db.collection("users").doc(uid).collection("friends").orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        li.className = "list-group-item d-flex align-items-center friend-item";

        // Random avatar from UI Avatars
        const img = document.createElement("img");
        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;
        li.appendChild(img);

        const text = document.createElement("span");
        text.textContent = `${data.name} | ${data.email} | ${data.phone}`;
        li.appendChild(text);

        friendsList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

