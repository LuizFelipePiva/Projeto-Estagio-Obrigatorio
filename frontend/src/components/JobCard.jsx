const formatDisplayDate = (date) => {
  if (!date) return "";

  const [year, month, day] = String(date).split("T")[0].split("-");

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return new Date(date).toLocaleDateString("pt-BR");
};

const formatRating = (rating) =>
  Number(rating).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onAction,
  onRemoveAplication,
  onShowCandidates,
  onComplete,
  actionLabel = "Aplicar",
}) {
  const statusConfig = {
    Pendente: {
      card: "bg-[#FAFFC2]",
      icon: "bg-[#E1D014]",
    },
    Aprovado: {
      card: "bg-[#C6FAD3]",
      icon: "bg-[#31ED60]",
    },
    Recusado: {
      card: "bg-[#F9C9C8]",
      icon: "bg-red-400",
    },
  };

  const status = statusConfig[job.flag_pendencia] ?? {
    card: "",
    icon: "",
  };

  const isCompleted = Number(job.flag_status) === 1;

  return (
    <div className={`bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition ${status.card}`}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>

        <div className="flex gap-2 flex-wrap justify-end">
          {job.modality && (
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shrink-0">
              {job.modality}
            </span>
          )}

          {job.flag_pendencia && (
            <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${status.icon}`}>
              {job.flag_pendencia}
            </span>
          )}

          {isCompleted && (
            <span className="text-xs px-3 py-1 rounded-full shrink-0 bg-green-600 text-white">
              Concluído
            </span>
          )}
        </div>
      </div>

      {job.category && (
        <p className="text-sm text-gray-500 mb-2">{job.category}</p>
      )}

      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-gray-500">Salário</span>
          <span className="font-medium text-green-600 text-right">
            R$ {Number(job.salary).toLocaleString("pt-BR")}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-gray-500">Local</span>
          <span className="text-right">{job.location}</span>
        </div>

        {job.data_final && (
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Prazo de Inscrição</span>
            <span className="text-right">{formatDisplayDate(job.data_final)}</span>
          </div>
        )}

        {isCompleted && job.nota_avaliacao != null && (
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Nota recebida</span>
            <span className="font-medium text-yellow-600 text-right">
              {formatRating(job.nota_avaliacao)} / 5
            </span>
          </div>
        )}
      </div>

      {(onEdit || onDelete || onAction || onRemoveAplication || onShowCandidates || onComplete) && (
        <div className="mt-5 flex gap-2">
          {onShowCandidates && (
            <button
              type="button"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => onShowCandidates(job)}
            >
              Mostrar Candidatos
            </button>
          )}

          {onComplete && (
            <button
              type="button"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => onComplete(job)}
            >
              Marcar como concluído
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              onClick={() => onEdit(job)}
            >
              Editar
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              onClick={() => onDelete(job)}
            >
              Excluir
            </button>
          )}

          {onAction && (
            <button
              type="button"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => onAction(job)}
            >
              {actionLabel}
            </button>
          )}

          {onRemoveAplication && (
            <button
              type="button"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => onRemoveAplication(job)}
            >
              Remover Candidatura
            </button>
          )}
        </div>
      )}
    </div>
  );
}
