import { useEffect, useState } from "react";

// importacao do api para fazer as requisicoes ao backend
import api from "../services/api";

// importacao de componentes
import DeleteJobModal from "../components/DeleteJobModal";
import EditJobModal from "../components/EditJobModal";

const formatDisplayDate = (date) => {
    if (!date) return "";

    const [year, month, day] = String(date).split("T")[0].split("-");

    if (year && month && day) {
        return `${day}/${month}/${year}`;
    }

    return new Date(date).toLocaleDateString("pt-BR");
};

export default function Jobs() {
    const [jobs, setJobs] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const getMyJobs = async () => {
            try {
                const response = await api.get("/jobs/myJobs");
                setJobs(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Erro ao buscar vagas:", error);
            }
        };

        getMyJobs();
    }, []);

    const openDeleteModal = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedJob(null);
    };

    const openEditModal = (job) => {
        setSelectedJob(job);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedJob(null);
    };

    const handleDelete = async () => {
        if (!selectedJob) return;

        try {
            setIsDeleting(true);
            await api.delete(`/jobs/${selectedJob.idvagas}`);

            setJobs((prev) =>
                prev.filter((job) => job.idvagas !== selectedJob.idvagas)
            );

            closeDeleteModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = async (formData) => {
        if (!selectedJob) return;

        try {
            setIsEditing(true);
            await api.put(`/jobs/${selectedJob.idvagas}`, { formData });

            setJobs((prev) =>
                prev.map((job) =>
                    job.idvagas === selectedJob.idvagas
                        ? { ...job, ...formData }
                        : job
                )
            );

            closeEditModal();
        } catch (error) {
            console.error("Erro ao editar vaga:", error);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div
                        key={job.idvagas}
                        className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {job.title}
                            </h3>

                            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                                {job.modality}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                            {job.category}
                        </p>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                            {job.description}
                        </p>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Salário</span>
                                <span className="font-medium text-green-600">
                                    R$ {Number(job.salary).toLocaleString("pt-BR")}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Local</span>
                                <span>{job.location}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Prazo de Inscrição </span>
                                <span>{formatDisplayDate(job.data_final)}</span>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => openEditModal(job)}
                            >
                                Editar
                            </button>

                            <button
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                                onClick={() => openDeleteModal(job)}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <DeleteJobModal
                isOpen={showDeleteModal}
                job={selectedJob}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />

            <EditJobModal
                isOpen={showEditModal}
                job={selectedJob}
                onClose={closeEditModal}
                onSubmit={handleEdit}
                isSubmitting={isEditing}
            />
        </>
    );
}
