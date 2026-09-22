import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

export function UnderDevelopment() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-200">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-2 flex items-center gap-1 text-xxs text-gray-500 transition hover:text-gray-600 cursor-pointer"
      >
        <ArrowLeft size={12} />
        Voltar
      </button>

      <div className="flex flex-col items-center gap-3 rounded-[10px] border border-gray-300 bg-gray-100 px-6 py-12 text-center">
        <Construction size={32} className="text-gray-500" />
        <h1 className="text-xl font-bold text-blue-900">Em desenvolvimento</h1>
        <p className="text-sm text-gray-500">
          Esta página ainda está sendo construída. Volte em breve.
        </p>
      </div>
    </div>
  );
}
