import { useAuth } from "@/hooks";
import { useFirebase } from "@/firebase-context";

export default function AuthButton() {
  const { user, authReady, logout } = useAuth();
  const { signInWithGoogle } = useFirebase();

  if (!authReady) return null;

  const className = "rounded-full bg-white shadow-md px-5 py-2 text-md font-medium text-gray-700 cursor-pointer transition hover:bg-gray-50 active:scale-95 dark:bg-gray-200 dark:shadow-none dark:hover:bg-gray-300";

  return user ? (
    <button
      onClick={logout}
      className={className}
    >
      Sign out ({user.displayName ?? user.email})
    </button>
  ) : (
    <button
      onClick={() => signInWithGoogle()}
      className={className}
    >
      Sign in
    </button>
  );
}
