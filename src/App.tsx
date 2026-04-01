import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { FirebaseContext } from "./firebase-context";
import Pepper from "./components/Pepper";
import LogoutButton from "./components/LogoutButton";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

type PepperData = {
  name: string;
  count: number;
  heat: number;
  image: string;
  format?: "regular" | "wide";
};

const PEPPERS: PepperData[] = [
  { name: "Shishito", count: 1, heat: 100, image: "shishito.jpg" },
  {
    name: "Peppapeach stripey",
    count: 2,
    heat: 1000,
    image: "peppapeach-stripeys.jpg",
  },
  { name: "Peachadew", count: 2, heat: 1000, image: "peachadews.jpg" },
  {
    name: "Aji White Fantasy",
    count: 1,
    heat: 7000,
    image: "aji-white-fantasy.jpg",
  },
  { name: "Fish Pepper", count: 2, heat: 30000, image: "fish-peppers.jpg" },
  {
    name: "Lemon Drop",
    count: 2,
    heat: 30000,
    image: "lemon-drops.jpg",
    format: "wide",
  },
  {
    name: "Sugar Rush Stripey",
    count: 2,
    heat: 40000,
    image: "sugar-rush-stripeys.jpg",
  },
  { name: "Jigsaw", count: 1, heat: 50000, image: "jigsaw.jpg" },
  {
    name: "Red Habanero",
    count: 3,
    heat: 300000,
    image: "red-habaneros.jpg",
    format: "wide",
  },
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [activePepper, setActivePepper] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ auth, db, user, authReady, signInWithGoogle }}
    >
      <div
        className="w-full grid grid-flow-row-dense grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-8 p-8"
        onClick={() => setActivePepper(null)}
      >
        {PEPPERS.map((pepper) => (
          <Pepper
            key={pepper.name}
            {...pepper}
            active={activePepper === pepper.name}
            onActivate={() => setActivePepper(pepper.name)}
          />
        ))}
      </div>
      <LogoutButton />
    </FirebaseContext.Provider>
  );
}

export default App;
