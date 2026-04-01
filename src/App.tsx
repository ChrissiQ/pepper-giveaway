import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { FirebaseContext } from "@/firebase-context";
import Pepper from "@/components/Pepper";
import AuthButton from "@/components/AuthButton";
import ThemeToggle from "@/components/ThemeToggle";
import VineLine from "@/components/VineLine";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectDatabaseEmulator(db, "localhost", 9000);
}

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="relative min-h-screen pt-4 pb-6 overflow-hidden border-green-800 dark:border-lime-800 border-t-16">
      <FirebaseContext.Provider
        value={{ auth, db, user, authReady, signInWithGoogle }}
      >
        <header className="flex w-full items-center justify-end gap-3 p-8">
          <AuthButton />
          <ThemeToggle />
        </header>
        <div className="relative px-[3vw] pt-16 md:pt-0">
            <VineLine
              className="absolute rotate-90 md:rotate-0 origin-[100%_50%] -top-12 md:top-auto md:-bottom-60 -left-6 md:-left-2  text-green-800 dark:text-lime-900 pointer-events-none w-56 md:w-64"
              style={{ height: "auto" }}
            />
          <div className="pt-32 md:pt-4 pb-12 md:pb-24 md:pl-32 md:mb-32">
            <div className="max-w-[60ch]">
              <h1 className="text-4xl font-bold mb-2">
                Chrissi has too many plants and doesn't have room for them all.
              </h1>
              <p className="text-md mb-12">Please take some.</p>
              <p className="text-lg mb-4">
                Claim what you'd like below, then drop me a message so we can
                sort out a day to meet at the office so you can pick them up.
              </p>
              <p className="text-md italic">
                * You'll need to collect from the office within a week or so, so
                only claim if you can make that work.
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full grid grid-flow-row-dense grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-8 p-[3vw] md:p-8 border-green-800 dark:border-lime-800 border-t-8 rounded-[5%] bg-white dark:bg-gray-900">
          {PEPPERS.map((pepper) => (
            <Pepper key={pepper.name} {...pepper} />
          ))}
        </div>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
