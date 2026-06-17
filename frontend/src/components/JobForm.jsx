import { useEffect, useState } from "react";
import { Briefcase, DollarSign, MapPin } from "lucide-react";

const formatDateForInput = (date) => {
  if (!date) return "";

  return String(date).split("T")[0];
};

const normalizeJobData = (job = {}) => ({
  title: job.title ?? "",
  category: job.category ?? "",
  modality: job.modality ?? "",
  salary: job.salary ?? "",
  location: job.location ?? "",
  data_final: formatDateForInput(job.data_final),
  description: job.description ?? "",
  requirements: job.requirements ?? "",
});

export default function JobForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => normalizeJobData(initialData));

  useEffect(() => {
    setFormData(normalizeJobData(initialData));
  }, [initialData]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Título da vaga
        </label>

        <div className="relative">
          <Briefcase
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Desenvolvedor Front-end React"
            className="w-full border rounded-lg pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
            <option>Redação</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Modalidade
          </label>

          <select
            required
            name="modality"
            value={formData.modality}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option>Remoto</option>
            <option>Presencial</option>
            <option>Híbrido</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Salário
          </label>

          <div className="relative">
            <DollarSign
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500">
              R$
            </span>

            <input
              required
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Ex: 3000"
              className="w-full border rounded-lg pl-16 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Localização
          </label>

          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: São Paulo - SP"
              className="w-full border rounded-lg pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Prazo para candidatura
        </label>

        <input
          type="date"
          name="data_final"
          value={formData.data_final}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Descrição da vaga
        </label>

        <textarea
          required
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva as atividades da vaga..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Requisitos
        </label>

        <textarea
          required
          rows="4"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Ex: React, Node.js, Git..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {cancelLabel}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
