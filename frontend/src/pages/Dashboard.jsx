import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";

const USER_TYPES = {
  FREELANCER: 0,
  CONTRATANTE: 1,
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // 🔐 Verificar usuário e carregar dados
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const response = await api.get("/auth/me");

        // ⚠️ ajuste aqui dependendo do backend
        setUser(response.data.user || response.data);

      } catch (err) {
        localStorage.removeItem("token");
        toast.error(err.response?.data?.message || "Sessão expirada");
        navigate("/login");
      }
    };

    /*const loadJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data);
      } catch (err) {
        console.log(err);
      }
    }; */

    loadUser();
    //loadJobs();
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //console.log(user.user_type, typeof user.user_type);

  // ⏳ Loading
  if (!user) {
    return <div className="p-6">Carregando...</div>;
  }

  const isFreelancer = user.user_type === USER_TYPES.FREELANCER;

  return (
    <div className="flex h-screen bg-gray-100">
      {console.log(user)}

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col justify-between">
        {console.log(user.user_type, typeof user.user_type)}
        <div>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="font-semibold">{user.name}</span>
          </div>

          {isFreelancer ? (
            <div className="space-y-2">
              <button onclick={() => navigate("/curriculum")} className="w-full bg-gray-200 p-2 rounded hover:bg-gray-300">
                Currículo
              </button>

              <button onClick={() => navigate("/applications")} className="w-full bg-gray-200 p-2 rounded hover:bg-gray-300">
                Vagas Aplicadas
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/jobs")} className="w-full bg-gray-200 p-2 rounded hover:bg-gray-300">
              Minhas vagas
            </button>
          )}
        </div>



      </aside >

      {/* CONTEÚDO */}
      < main className="flex-1 p-6 overflow-auto" >

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              👋 Bem-vindo, {user.name}
            </h1>
            <p className="text-gray-500">
              Aqui está seu painel
            </p>
          </div>

          {/* LOGOUT TOP RIGHT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        {/* MENSAGEM */}
        < div className="bg-white p-4 rounded-xl shadow mb-6" >
          <p className="text-gray-600">
            Gerencie suas vagas e aplicações de forma simples.
          </p>
        </div >

        {/* BOTÃO CONTRATANTE */}
        {
          !isFreelancer && (
            <div className="bg-white p-4 rounded-xl shadow mb-6">
              <button
                onClick={() => navigate("/jobs/create")}
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
              >
                + Cadastrar vaga
              </button>
            </div>
          )
        }

        {/* BUSCA */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
          <input
            placeholder="Buscar vagas..."
            className="flex-1 border p-2 rounded focus:outline-none"
          />
          <button className="bg-gray-200 px-4 rounded hover:bg-gray-300">
            Filtro
          </button>
        </div>

        {/* LISTA DE VAGAS */}
        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="font-semibold mb-4">
            {isFreelancer ? "Vagas disponíveis" : "Minhas vagas"}
          </h2>

          {jobs.length === 0 ? (
            <p className="text-gray-500">
              Nenhuma vaga encontrada
            </p>
          ) : (
            <div className="space-y-3">

              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job.description}
                    </p>
                  </div>

                  {/* BOTÃO FREELANCER */}
                  {isFreelancer && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Aplicar
                    </button>
                  )}
                </div>
              ))}

            </div>
          )}

        </div>

      </main >
    </div >
  );
}