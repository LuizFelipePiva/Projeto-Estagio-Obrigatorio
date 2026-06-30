import Modal from "./modal";

const variantClasses = {
  danger: "bg-red-500 hover:bg-red-600",
  success: "bg-green-600 hover:bg-green-700",
  primary: "bg-blue-600 hover:bg-blue-700",
};

export default function ConfirmActionModal({
  isOpen,
  title = "Confirmar acao",
  message,
  subject,
  onClose,
  onConfirm,
  isLoading = false,
  loadingText = "Processando...",
  confirmText = "Confirmar",
  confirmDisabled = false,
  variant = "danger",
}) {
  const confirmClass = variantClasses[variant] ?? variantClasses.primary;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        {title}
      </h2>

      <p className="text-gray-600 mb-6">
        {message}
        {subject && <span className="font-semibold"> {subject}</span>}?
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading || confirmDisabled}
          className={`px-4 py-2 rounded-lg text-white disabled:cursor-not-allowed disabled:opacity-70 ${confirmClass}`}
        >
          {isLoading ? loadingText : confirmText}
        </button>
      </div>
    </Modal>
  );
}
