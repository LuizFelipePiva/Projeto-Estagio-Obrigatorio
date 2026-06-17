import { useState } from "react";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";


// import da api
import api from "../services/api";

export default function CreateJob() {

    const { user, isFreelancer } = useOutletContext();

    const Navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        modality: "",
        salary: "",
        location: "",
        data_final: "",
        description: "",
        requirements: "",
        
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const responde = await api.post("/jobs/createJob", 
            {
                formData,
                id_user: user.id,
            }
        );
        Navigate("/dashboard");
        //console.log(formData);
    };


    return (
        <div className="min-h-screen py-10 px-4">
            <div className="w-[95%] mx-auto bg-white rounded-2xl shadow-lg p-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Nova Vaga
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Preencha as informações da vaga que deseja publicar.
                    </p>
                    <hr className="border-gray-300 mt-4" />
                </div>

                

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* TÍTULO */}
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

                    {/* CATEGORIA + MODALIDADE */}
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

                    {/* SALÁRIO + LOCALIZAÇÃO */}
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
                                    placeholder="Ex: R$ 3.000 - R$ 5.000"
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

                    {/* DESCRIÇÃO */}
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

                    {/* REQUISITOS */}
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

                    {/* BOTÕES */}
                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition hover:bg-red-200 hover:border-red-500 "
                            onClick={() => { Navigate("/dashboard") }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                        >
                            Publicar vaga
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}