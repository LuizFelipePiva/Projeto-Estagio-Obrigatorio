import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import ApplyJobModal from "../components/ApplyJobModal";
import JobCard from "../components/JobCard";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();
  const { isFreelancer } = useOutletContext();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const endpoint = isFreelancer ? "/jobs/allJobs" : "/jobs/myJobs";
        const response = await api.get(endpoint);
        setJobs(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };

    loadJobs();
  }, [isFreelancer]);

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
  };

  const handleApply = async () => {
    if (!selectedJob) return;


    try {
      setIsApplying(true);
      console.log("Aplicar vaga:", selectedJob);

      const response = await api.post(`/jobs/${selectedJob.id_vagas}/apply`);

      toast.success(response.data?.message || "Candidatura realizada com sucesso");
      closeApplyModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao se candidatar para a vaga");
      closeApplyModal();
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
      {!isFreelancer && (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <button
            type="button"
            onClick={() => navigate("/jobs/create")}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            + Cadastrar vaga
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
        <input
          placeholder="Buscar vagas..."
          className="flex-1 border p-2 rounded focus:outline-none"
        />
        <button
          type="button"
          className="bg-gray-200 px-4 rounded hover:bg-gray-300"
        >
          Filtro
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Vagas disponíveis</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500">Nenhuma vaga encontrada</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id_vagas}
                job={job}
                onAction={isFreelancer ? openApplyModal : undefined}
                actionLabel="Aplicar"
              />
            ))}
          </div>
        )}
      </div>
      </div>

      <ApplyJobModal
        isOpen={showApplyModal}
        job={selectedJob}
        onClose={closeApplyModal}
        onConfirm={handleApply}
        isApplying={isApplying}
      />
    </>
  );
}
