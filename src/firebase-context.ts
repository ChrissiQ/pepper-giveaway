import { createContext, useContext } from "react";
import type { Auth, User, UserCredential } from "firebase/auth";
import type { Database } from "firebase/database";

export type FirebaseContextValue = {
  auth: Auth;
  db: Database;
  user: User | null;
  authReady: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
};

export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("useFirebase must be used within FirebaseProvider");
  return ctx;
}
