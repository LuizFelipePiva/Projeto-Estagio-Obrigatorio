import api from '../services/api';

import { useEffect, useState } from 'react';

import JobCard from '../components/JobCard';

export default function VagasAplicadas() {

  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await api.get('/vagas/minhasVagas/:id_usuario');
        setAppliedJobs(response.data);
      } catch (error) {
        console.error('Erro ao buscar vagas aplicadas:', error);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {appliedJobs.map((job) => (
          <JobCard
            key={job.id_vagas}
            job={job}
            onEdit={null}
            onDelete={null}
          />
        ))}
      </div>
    </>
  );
}