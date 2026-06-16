import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [accountType, setAccountType] = useState("freelancer");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("As senhas nao coincidem");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        accountType,
        confirmPassword,
      });

      toast.success(response.data?.message || "Registro realizado com sucesso");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro no registro");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
        <div className="text-white text-center px-10">
          <h1 className="text-4xl font-bold mb-4">
            Crie sua conta
          </h1>
          <p className="text-lg opacity-80">
            Comece a organizar seus projetos e clientes hoje mesmo.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Cadastro
          </h2>

          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-2">
              Tipo de conta
            </label>

            <div className="relative grid grid-cols-2 rounded-xl bg-gray-100 p-1">
              <span
                className={`absolute left-1 top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-transform duration-200 ${
                  accountType === "contratante" ? "translate-x-full" : ""
                }`}
              />

              <button
                type="button"
                onClick={() => setAccountType("freelancer")}
                aria-pressed={accountType === "freelancer"}
                className={`relative z-10 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  accountType === "freelancer" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Freelancer
              </button>

              <button
                type="button"
                onClick={() => setAccountType("contratante")}
                aria-pressed={accountType === "contratante"}
                className={`relative z-10 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  accountType === "contratante" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Contratante
              </button>
            </div>
          </div>
          

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Nome
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="mb-6 relative">
            <label className="block text-sm text-gray-600 mb-1">
              Senha
            </label>

            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="********"
              className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {mostrarSenha ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>

          <div className="mb-6 relative">
            <label className="block text-sm text-gray-600 mb-1">
              Confirmar Senha
            </label>

            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="********"
              className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {mostrarSenha ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleRegister}
          >
            Cadastrar
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Ja tem conta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer"
            >
              Fazer login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
