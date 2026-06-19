import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";

const emptyProfile = {
  category: "",
  description: "",
  habilities: "",
  telefone: "",
};

export default function Curriculum() {
  const { isFreelancer } = useOutletContext();
  const [formData, setFormData] = useState(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile/freelancer");

        if (response.data) {
          setFormData({
            category: response.data.category ?? "",
            description: response.data.description ?? "",
            habilities: response.data.habilities ?? "",
            telefone: response.data.telefone ?? "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Erro ao carregar curriculo");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await api.put("/profile/freelancer", formData);
      toast.success(response.data?.message || "Curriculo salvo com sucesso");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao salvar curriculo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFreelancer) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-600">Curriculo disponivel apenas para freelancers.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-6">Carregando curriculo...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 w-[95%] justify-self-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu curriculo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Categoria
          </label>
          <select
            required
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option>Desenvolvimento</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Redacao</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Descricao
          </label>
          <textarea
            required
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Conte um pouco sobre sua experiencia profissional..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Habilidades
          </label>
          <textarea
            required
            rows="4"
            name="habilities"
            value={formData.habilities}
            onChange={handleChange}
            placeholder="Ex: React, Node.js, Figma, copywriting..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Telefone para contato
          </label>
          <input
            required
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Ex: (11) 99999-9999"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Salvando..." : "Salvar curriculo"}
          </button>
        </div>
      </form>
    </div>
  );
}
