import { LogOut } from "lucide-react";

export default function Topbar({ user, onLogout }) {
    return (
        <header className="h-20 bg-white flex justify-end items-center px-6 relative border-b border-gray-200 shadow-md">
            
            <div className="flex items-center gap-4">
        
                <div className="text-right">
                    <p className="font-semibold text-black">
                        {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user.user_type === 0
                            ? "Freelancer"
                            : "Contratante"}
                    </p>
                </div>

                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-400 transition"
                >
                    <LogOut size={18} />
                    Sair
                </button>

            </div>
        </header>
    );
}