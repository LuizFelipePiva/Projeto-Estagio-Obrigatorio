import { useEffect, useState } from "react";

import api from "../../../services/api";
import JobCard from "../../../shared/components/JobCard";

export default function FinishedJobs() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);

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

  useEffect(() => {
    const calculateAverageRating = () => {
      if (projects.length > 0) {
        var media = 0;
        for (let i = 0; i < projects.length; i++) {

          if (projects[i].nota_avaliacao !== null)
            media += parseInt(projects[i].nota_avaliacao);
        }
      }
      media = media / projects.length;
      media = Math.round(media * 2) / 2;
      setAverageRating(media);

    };
    calculateAverageRating();
  }, [projects]);



  if (isLoading) {
    return <p className="text-gray-600">Carregando projetos concluídos...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Projetos concluídos
          </h1>
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shrink-0">
            {projects.length} projetos
          </span>

          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shrink-0">
            {averageRating} estrelas
          </span>

        </div>

        <p className="text-gray-500 mt-1">
          Vagas aprovadas que já foram finalizadas pelo contratante.
        </p>
        <div className="flex gap-2 flex-wrap justify-end">


        </div>
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
