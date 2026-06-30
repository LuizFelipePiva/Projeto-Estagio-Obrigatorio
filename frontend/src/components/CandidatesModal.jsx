import Modal from "./modal";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaCheck, FaXmark } from "react-icons/fa6";

export default function CandidatesModal({
  isOpen,
  job,
  candidates,
  isLoading,
  error,
  onClose,
  onAprove,
  onRecuse,
  onChat
}) {
  const title = job?.title ? `Candidatos - ${job.title}` : "Candidatos";

  const statusConfig = {
    Pendente: {
      card: "bg-[#FAFFC2]",
      icon: "bg-[#E1D014]"
    },
    Aprovado: {
      card: "bg-[#C6FAD3]",
      icon: "bg-[#31ED60]"
    },
    Recusado: {
      card: "bg-[#F9C9C8]",
      icon: "bg-red-400"
    }
  };
  //console.log(candidates.flag_pendencia)
  // const status = statusConfig[candidates.flag_pendencia] ?? {
  //   card: "",
  //   icon: ""
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {candidates.length} candidato{candidates.length === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Fechar
        </button>
      </div>

      {isLoading && (
        <p className="text-gray-600">Carregando candidatos...</p>
      )}

      {!isLoading && error && (
        <p className="text-red-600">{error}</p>
      )}

      {!isLoading && !error && candidates.length === 0 && (
        <p className="text-gray-600">Nenhum candidato se aplicou para esta vaga ainda.</p>
      )}

      {!isLoading && !error && candidates.length > 0 && (
        <div className="space-y-3">
          {candidates.map((candidate) => {
            const status = statusConfig[candidate.flag_pendencia] ?? {
              card: "",
              icon: "bg-gray-100 text-gray-700",
            };

            return (
              <div
                key={candidate.idvagas_aplicadas}
                className={`border border-gray-200 rounded-lg p-3`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {candidate.email}
                    </p>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${status.icon}`}>
                    {candidate.flag_pendencia}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="block text-gray-500">Telefone</span>
                    <span className="text-gray-800">
                      {candidate.telefone || "Nao informado"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-gray-500">Categoria</span>
                    <span className="text-gray-800">
                      {candidate.category || "Nao informada"}
                    </span>
                  </div>
                </div>

                {candidate.habilities && (
                  <div className="mt-3 text-xs">
                    <span className="block text-gray-500">Habilidades</span>
                    <p className="text-gray-800 whitespace-pre-line line-clamp-2">
                      {candidate.habilities}
                    </p>
                  </div>
                )}

                {candidate.description && (
                  <div className="mt-3 text-xs">
                    <span className="block text-gray-500">Descricao</span>
                    <p className="text-gray-800 whitespace-pre-line line-clamp-2">
                      {candidate.description}
                    </p>
                  </div>
                )}

                {(onAprove || onRecuse) && candidate.flag_pendencia === "Pendente" && (
                  <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 text-xs font-medium flex gap-1 items-center hover:bg-blue-200"
                      onClick={() => onChat(candidate)}
                    >
                      <IoChatboxEllipsesOutline />
                      Chat
                    </button>

                    {onRecuse && (
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1 hover:bg-red-200"
                        onClick={() => onRecuse(candidate)}
                      >
                        <FaXmark />
                        Recusar
                      </button>
                    )}

                    {onAprove && (
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1 hover:bg-green-200"
                        onClick={() => onAprove(candidate)}
                      >
                        <FaCheck />
                        Aprovar
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
