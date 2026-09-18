import { useState } from "react";
import { Star } from "lucide-react";

import Modal from "../../../shared/components/Modal";

export default function CompleteJobModal({
  isOpen,
  job,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [rating, setRating] = useState(5);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Concluir vaga
      </h2>

      <p className="text-gray-600 mb-5">
        Selecione uma nota para o freelancer antes de concluir
        <span className="font-semibold"> {job?.title}</span>.
      </p>

      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            disabled={isLoading}
            className="p-1 disabled:cursor-not-allowed"
            aria-label={`Nota ${value}`}
          >
            <Star
              size={34}
              className={
                value <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>

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
          onClick={() => onConfirm(rating)}
          disabled={isLoading || !job}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Concluindo..." : "Concluir"}
        </button>
      </div>
    </Modal>
  );
}
