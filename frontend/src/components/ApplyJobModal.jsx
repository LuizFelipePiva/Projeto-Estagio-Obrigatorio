import Modal from "./modal";

export default function ApplyJobModal({
  isOpen,
  job,
  onClose,
  onConfirm,
  isApplying = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Confirmar candidatura
      </h2>

      <p className="text-gray-600 mb-6">
        Tem certeza que deseja se candidatar para a vaga
        <span className="font-semibold"> {job?.title}</span>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isApplying}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isApplying || !job}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isApplying ? "Aplicando..." : "Confirmar"}
        </button>
      </div>
    </Modal>
  );
}
