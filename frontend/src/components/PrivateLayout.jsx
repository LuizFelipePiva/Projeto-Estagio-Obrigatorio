import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";

const USER_TYPES = {
  FREELANCER: 0,
  CONTRATANTE: 1,
};

export default function PrivateLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user || response.data);
      } catch (err) {
        localStorage.removeItem("token");
        toast.error(err.response?.data?.message || "Sessao expirada");
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <div className="p-6">Carregando...</div>;
  }

  const isFreelancer = user.user_type === USER_TYPES.FREELANCER;

  return (
    <div className="flex h-screen bg-[#f2f7fb]">
      <Sidebar
        user={user}
        isFreelancer={isFreelancer}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Topbar
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet
            context={{
              user,
              isFreelancer
            }}
          />
        </main>
      </div>
    </div>
  );
}
