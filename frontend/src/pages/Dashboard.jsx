import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";


export default function Dashboard() {
  const [jobs] = useState([]);
  const navigate = useNavigate();
  const { user, isFreelancer } = useOutletContext();

  return (
    <div className="space-y-6">
            

      {/* Acao exclusiva do contratante para cadastrar uma nova vaga. */}
      {!isFreelancer && (
        <div className="bg-[#f4f4f8] p-4 rounded-xl shadow mb-6">
          <button
          
            type="button"
            onClick={() => navigate("/jobs/create")}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            
            + Cadastrar vaga
          </button>
        </div>
      )}

      {/* Barra de busca e filtro para procurar vagas dentro da dashboard. */}
      <div className="bg-[#f4f4f8] p-4 rounded-xl shadow mb-6 flex gap-4">
        <input
          placeholder="Buscar vagas..."
          className="flex-1 border p-2 rounded focus:outline-none "
        />
        <button
        
          type="button"
          className="bg-gray-200 px-4 rounded hover:bg-gray-300"
        >
          Filtro
        </button>
      </div>

      {/* Secao que lista vagas disponiveis para freelancer ou vagas do contratante. */}
      <div className="bg-[#f4f4f8] p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Vagas disponíveis
        </h2>

        {/* Mensagem exibida quando ainda nao existem vagas carregadas. */}
        {jobs.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma vaga encontrada
          </p>
        ) : (
          <div className="space-y-3">
            {/* Cada card representa uma vaga com titulo, descricao e acao. */}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.description}
                  </p>
                </div>

                {/* Botao mostrado apenas para freelancer se candidatar a vaga. */}
                {isFreelancer && (
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Aplicar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
