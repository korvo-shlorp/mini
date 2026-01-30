export default function SuggestionBox({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-gray-700 text-gray-300 hover:border-primary hover:bg-gray-800/50 hover:text-white transition-all duration-200 text-sm"
    >
      <span className="text-primary font-semibold">→</span> {text}
    </button>
  )
}
