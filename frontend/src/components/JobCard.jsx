const formatDisplayDate = (date) => {
  if (!date) return "";

  const [year, month, day] = String(date).split("T")[0].split("-");

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return new Date(date).toLocaleDateString("pt-BR");
};

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onAction,
  onRemoveAplication,
  onShowCandidates,
  actionLabel = "Aplicar",
}) {

  //var nome_pendencia = "";
  var classe_flag_pendencia = "";
  var status = "";

  if (job.flag_pendencia) {
    const statusConfig = {
      Pendente: {
        card: "bg-yellow-100",
        icon: "bg-yellow-400"
      },
      Aprovado: {
        card: "bg-green-100",
      },
      Recusado: {
        card: "bg-red-200",
        icon: "bg-red-400"
      }
    }
    status = statusConfig[job.flag_pendencia];
  }

  console.log(job)

  return (
    <div className={`bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition ${status.card}`}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>

        <div className="flex gap-2">
          {job.modality && (
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shrink-0 items-end">
              {job.modality}
            </span>
          )}
          {job.flag_pendencia && (
            <span className={`text-xs px-3 py-1 rounded-full shrink-0 items-end ${status.card, status.icon}`} >
              {job.flag_pendencia}
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
        {(job.data_final) &&
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Prazo de Inscrição</span>
            <span className="text-right">{formatDisplayDate(job.data_final)}</span>
          </div>
        }
      </div>


      {(onEdit || onDelete || onAction || onRemoveAplication || onShowCandidates) && (
        <div className="mt-5 flex gap-2">
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

          {onShowCandidates && (
            <button
            type="button"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => onShowCandidates(job)}
            >
              Mostrar Candidatos
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
