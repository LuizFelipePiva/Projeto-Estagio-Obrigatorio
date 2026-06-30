import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronDown, Filter } from "lucide-react";

import api from "../services/api";
import ApplyJobModal from "../components/ApplyJobModal";
import JobCard from "../components/JobCard";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const navigate = useNavigate();
  const { isFreelancer } = useOutletContext();

  const categoryOptions = Array.from(
    new Set(jobs.map((job) => job.category).filter(Boolean))
  );

  const modalityOptions = Array.from(
    new Set(jobs.map((job) => job.modality).filter(Boolean))
  );

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      String(job.title ?? "").toLowerCase().includes(search);

    const matchesFilter =
      filterType === "all" ||
      !filterValue ||
      String(job[filterType] ?? "") === filterValue;

    return matchesSearch && matchesFilter;
  });

  const filterLabel = {
    all: "Filtro",
    category: "Categoria",
    modality: "Modalidade",
  }[filterType];

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

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setFilterValue("");
    setShowFilterOptions(false);
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    try {
      setIsApplying(true);
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

        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col lg:flex-row gap-4">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar vagas..."
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterOptions((prev) => !prev)}
              className="w-full lg:w-44 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} />
                {filterLabel}
              </span>
              <ChevronDown size={16} />
            </button>

            {showFilterOptions && (
              <div className="absolute right-0 top-12 w-52 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20">
                <button
                  type="button"
                  onClick={() => handleFilterTypeChange("all")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterTypeChange("category")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                  Categoria
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterTypeChange("modality")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                  Modalidade
                </button>
              </div>
            )}
          </div>

          {filterType !== "all" && (
            <select
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="w-full lg:w-56 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {filterType === "category"
                  ? "Todas as categorias"
                  : "Todas as modalidades"}
              </option>
              {(filterType === "category" ? categoryOptions : modalityOptions).map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Vagas disponiveis</h2>

          {filteredJobs.length === 0 ? (
            <p className="text-gray-500">Nenhuma vaga encontrada</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
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
