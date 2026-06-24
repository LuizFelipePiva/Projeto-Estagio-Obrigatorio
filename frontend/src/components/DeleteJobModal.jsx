import Modal from "./modal";

export default function DeleteJobModal({
  isOpen,
  job,
  onClose,
  onConfirm,
  isDeleting = false,
  title,

}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Confirmar exclusão
      </h2>

      <p className="text-gray-600 mb-6">
        {title}
        <span className="font-semibold"> {job?.title}</span>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting || !job}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    </Modal>
  );
}
