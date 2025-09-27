"use client";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation"; // yeni App Router
import { useUser } from "../../context/userContext";

export default function LogoutButton() {
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    logout(); // context logout fonksiyonu
    router.push("/"); // logout sonrası yönlendirme
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-left"
    >
      <FiLogOut className="mr-2 w-5 h-5" />
      Çıkış Yap
    </button>
  );
}
