import JobForm from "./JobForm";
import Modal from "./modal";

export default function EditJobModal({
  isOpen,
  job,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="max-w-3xl max-h-[90vh] overflow-y-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Editar vaga</h2>
        <p className="text-gray-500 mt-1">
          Atualize as informações da vaga selecionada.
        </p>
      </div>

      <JobForm
        initialData={job}
        onSubmit={onSubmit}
        onCancel={onClose}
        submitLabel="Salvar alterações"
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
