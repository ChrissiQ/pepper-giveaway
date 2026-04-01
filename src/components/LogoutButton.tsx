import { useAuth } from "@/hooks";

export default function LogoutButton() {
  const { user, authReady, logout } = useAuth();

  if (!authReady || !user) return null;

  return (
    <div className="w-full p-8 text-center">
      <button
        onClick={logout}
        className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 cursor-pointer transition hover:bg-gray-300 active:scale-95"
      >
        Sign out ({user.displayName ?? user.email})
      </button>
    </div>
  );
}
