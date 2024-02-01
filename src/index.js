import {initializeApp} from 'firebase/app'
import {addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc} from 'firebase/firestore'
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBUVeF5UslsePBuvyZcO0ZtClfPsfw_0zY",
    authDomain: "uas-lab-bdd-24d2d.firebaseapp.com",
    projectId: "uas-lab-bdd-24d2d",
    storageBucket: "uas-lab-bdd-24d2d.appspot.com",
    messagingSenderId: "238774012768",
    appId: "1:238774012768:web:ef1c76ad7b9b84b364ec05"
  };

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt'))

// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []

    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id})
    })

    console.log(books);
})

// adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset()
    })
})

// deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
})

// get a single document
const docRef = doc(db, 'books', 'c8KHUP2d5mhSXWQNnStt')
const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
})

// updating a documents
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateForm.reset()
    })
})

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            //console.log('user created :', cred.user);
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message);
        })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            //console.log('the user signed out');
        })
        .catch((err) => {
            console.log(err.message);
        })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            //console.log('user logged in :', cred.user);
        })
        .catch((err) => {
            console.log(err.message);
        })
})

// subcribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed :', user);
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');
    unsubCol()
    unsubDoc()
    unsubAuth()
})