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
  actionLabel = "Aplicar",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>

        {job.modality && (
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shrink-0">
            {job.modality}
          </span>
        )}
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

        <div className="flex justify-between gap-3">
          <span className="text-gray-500">Prazo de Inscrição</span>
          <span className="text-right">{formatDisplayDate(job.data_final)}</span>
        </div>
      </div>

      {(onEdit || onDelete || onAction) && (
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
        </div>
      )}
    </div>
  );
}
