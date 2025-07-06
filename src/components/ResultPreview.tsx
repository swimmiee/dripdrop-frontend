import type { CoffeeMenu } from "../data/coffee";

interface ResultPreviewProps {
  result: CoffeeMenu | null;
  onCraft?: () => void;
  canCraft?: boolean;
  isLoading?: boolean;
}

function ResultPreview({
  result,
  onCraft,
  canCraft = false,
  isLoading = false,
}: ResultPreviewProps) {
  const handleCraft = () => {
    if (onCraft && canCraft) {
      onCraft();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-coffee mb-4">Result</h3>
      <div className="w-24 h-24 bg-white border-4 border-coffee rounded-lg flex items-center justify-center">
        {result ? (
          result.image ? (
            <img
              src={result.image}
              alt={result.name}
              className="w-20 h-20 object-contain"
            />
          ) : (
            <div className="text-4xl">{result.icon}</div>
          )
        ) : (
          <div className="text-gray-400 text-sm">?</div>
        )}
      </div>

      {result && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-coffee">{result.name}</p>
          {result.description && (
            <p className="text-xs text-gray-600 mt-1">{result.description}</p>
          )}
        </div>
      )}

      <button
        onClick={handleCraft}
        disabled={!canCraft || isLoading}
        className={`mt-4 px-6 py-2 rounded font-medium transition-colors ${
          canCraft && !isLoading
            ? "bg-coffee text-white hover:bg-coffee-dark"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Crafting..." : "Craft"}
      </button>

      <p className="text-xs text-gray-600 mt-2 text-center">
        {isLoading
          ? "Processing..."
          : canCraft
          ? "Ready to craft!"
          : "Place ingredients in the grid"}
      </p>
    </div>
  );
}

export default ResultPreview;
