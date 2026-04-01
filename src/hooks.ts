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
import { useFirebase } from "@/firebase-context";

export type Reservation = { key: string; name: string; email: string };

export function useAuth() {
  const { user, auth, authReady } = useFirebase();
  const logout = useCallback(() => signOut(auth), [auth]);
  return { user, authReady, logout };
}

export function useReservations(pepperName: string, limit: number) {
  const { db, user, authReady, signInWithGoogle } = useFirebase();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dbRef = ref(db, `reservations/${pepperName}`);
    return onValue(dbRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val() as Record<
        string,
        { name: string; email: string }
      > | null;
      setReservations(
        data
          ? Object.entries(data).map(([key, { name, email }]) => ({
              key,
              name,
              email,
            }))
          : [],
      );
    });
  }, [db, pepperName]);

  const reserve = async () => {
    if (!authReady) return;
    let resolvedUser = user;
    if (!resolvedUser) {
      const result = await signInWithGoogle();
      resolvedUser = result.user;
    }
    const email = resolvedUser.email;
    if (!email) return;
    const name = resolvedUser.displayName ?? email;
    const dbRef = ref(db, `reservations/${pepperName}`);
    const newKey = push(dbRef).key!;
    await runTransaction(
      dbRef,
      (current: Record<string, { name: string; email: string }> | null) => {
        const existing = current ?? {};
        if (Object.keys(existing).length >= limit) return;
        return { ...existing, [newKey]: { name, email } };
      },
    );
  };

  const unreserve = async (key: string) => {
    await remove(child(ref(db, `reservations/${pepperName}`), key));
  };

  return { reservations, reserve, unreserve, loading };
}
