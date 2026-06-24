import { useEffect, useState } from "react";

import api from "../services/api";
import DeleteJobModal from "../components/DeleteJobModal";
import EditJobModal from "../components/EditJobModal";
import JobCard from "../components/JobCard";

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
      await api.delete(`/jobs/${selectedJob.id_vagas}`);
      setJobs((prev) =>
        prev.filter((job) => job.id_vagas !== selectedJob.id_vagas)
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
      await api.put(`/jobs/${selectedJob.id_vagas}`, { formData });
      setJobs((prev) =>
        prev.map((job) =>
          job.id_vagas === selectedJob.id_vagas ? { ...job, ...formData } : job
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Erro ao editar vaga:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const openCandidatesModal = () => {
    console.log("teste")
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id_vagas}
            job={job}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onShowCandidates={openCandidatesModal}
          />
        ))}
      </div>

      <DeleteJobModal
        isOpen={showDeleteModal}
        job={selectedJob}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title={"Tem certeza que deseja excluir a vaga"}
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
