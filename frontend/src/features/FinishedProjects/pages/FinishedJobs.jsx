import { useEffect, useState } from "react";

import api from "../../../services/api";
import JobCard from "../../../shared/components/JobCard";

export default function FinishedJobs() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompletedProjects = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/jobs/completed");
        setProjects(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erro ao buscar projetos concluídos");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedProjects();
  }, []);

  if (isLoading) {
    return <p className="text-gray-600">Carregando projetos concluídos...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Projetos concluídos
        </h1>
        <p className="text-gray-500 mt-1">
          Vagas aprovadas que já foram finalizadas pelo contratante.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Nenhum projeto concluído encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <JobCard key={project.id_vagas} job={project} />
          ))}
        </div>
      )}
    </div>
  );
}
