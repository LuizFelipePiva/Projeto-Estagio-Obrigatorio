import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import da api
import api from "../services/api";

// importacao de componentes
import JobForm from "../components/JobForm";

export default function CreateJob() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            await api.post("/jobs/createJob", { formData });
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao criar vaga:", error);
        } finally {
            setIsSubmitting(false);
        }
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

                <JobForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/dashboard")}
                    submitLabel="Publicar vaga"
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
