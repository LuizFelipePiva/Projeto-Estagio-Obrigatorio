import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(response.data);
      toast.success(response.data?.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao fazer login");
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen">

      {/* LADO ESQUERDO */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
        <div className="text-white text-center px-10">
          <h1 className="text-4xl font-bold mb-4">
            Gerencie seus projetos
          </h1>
          <p className="text-lg opacity-80">
            Organize clientes, tarefas e pagamentos em um só lugar.
          </p>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Bem-vindo
          </h2>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* SENHA */}
          <div className="mb-6 relative">
            <label className="block text-sm text-gray-600 mb-1">
              Senha
            </label>

            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="••••••••"
              className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* OLHINHO */}
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {mostrarSenha ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>

          {/* BOTÃO */}
          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Entrar
          </button>

          {/* LINK */}
          <p className="text-sm text-gray-500 text-center mt-4">
            Não tem conta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer"
            >
              Cadastre-se
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
