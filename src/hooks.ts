import { useCallback, useEffect, useState } from "react";
import {
  child,
  onValue,
  push,
  ref,
  remove,
  runTransaction,
} from "firebase/database";
import { signOut } from "firebase/auth";
import { useFirebase } from "./firebase-context";

export type Reservation = { key: string; name: string };

export function useAuth() {
  const { user, auth, authReady } = useFirebase();
  const logout = useCallback(() => signOut(auth), [auth]);
  return { user, authReady, logout };
}

export function useReservations(pepperName: string, limit: number) {
  const { db, user, authReady, signInWithGoogle } = useFirebase();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const dbRef = ref(db, `reservations/${pepperName}`);
    return onValue(dbRef, (snapshot) => {
      const data = snapshot.val() as Record<string, string> | null;
      setReservations(
        data ? Object.entries(data).map(([key, name]) => ({ key, name })) : [],
      );
    });
  }, [db, pepperName]);

  const reserve = async () => {
    if (!authReady) return;
    let name: string;
    if (user) {
      name = user.displayName ?? user.email ?? "Anonymous";
    } else {
      const { user: signedInUser } = await signInWithGoogle();
      name = signedInUser.displayName ?? signedInUser.email ?? "Anonymous";
    }
    const dbRef = ref(db, `reservations/${pepperName}`);
    const newKey = push(dbRef).key!;
    await runTransaction(dbRef, (current: Record<string, string> | null) => {
      const existing = current ?? {};
      if (Object.keys(existing).length >= limit) return;
      return { ...existing, [newKey]: name };
    });
  };

  const unreserve = async (key: string) => {
    await remove(child(ref(db, `reservations/${pepperName}`), key));
  };

  return { reservations, reserve, unreserve };
}
