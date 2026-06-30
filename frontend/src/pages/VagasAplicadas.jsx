import api from '../services/api';

import { useEffect, useState } from 'react';

import JobCard from '../components/JobCard';
import RemoveJobModal from "../components/DeleteJobModal";


export default function VagasAplicadas() {

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const modalTitle = "Tem certeza que deseja remover a candidatura de";

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await api.get('/vagas/minhasVagas');
        setAppliedJobs(response.data);
      } catch (error) {
        console.error('Erro ao buscar vagas aplicadas:', error);
      }
    };

    fetchAppliedJobs();
  }, []);

  const openRemoveModal = (job) => {
    setSelectedJob(job);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedJob(null);
  };

  const handleRemoveAplication = async () => {
    if (!selectedJob) return;

    const applicationId = selectedJob.idvagas_aplicadas;

    if (applicationId == null) {
      console.error("Candidatura sem idvagas_aplicadas:", selectedJob);
      return;
    }

    try {
      setIsRemoving(true);
      await api.delete(`/vagas/minhasVagas/removerCandidatura/${applicationId}`);
      setAppliedJobs((prev) =>
        prev.filter((job) => job.idvagas_aplicadas !== applicationId)
      );
      closeRemoveModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemoving(false);
    }

  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {appliedJobs.map((job) => (
          <JobCard
            key={job.id_vagas}
            job={job}
            onRemoveAplication={openRemoveModal}
          />
        ))}
      </div>

      <RemoveJobModal
        isOpen={showRemoveModal}
        job={selectedJob}
        onClose={closeRemoveModal}
        onConfirm={handleRemoveAplication}
        isDeleting={isRemoving}
        title={modalTitle}
        btnName={{
          name1: "Removendo...",
          name2: "Remover"
        }}
      />
    </>
  );
}
