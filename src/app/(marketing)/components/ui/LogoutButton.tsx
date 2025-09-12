"use client";

import { useRouter } from "next/navigation"; // yeni App Router
import { useUser } from "../../context/userContext";

export default function LogoutButton() {
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // context logout fonksiyonu
    router.push("/"); // logout sonrası yönlendirme
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-left"
    >
      Çıkış Yap
    </button>
  );
}
