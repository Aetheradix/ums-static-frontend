interface Props {
  text: string;
  author: string;
  timestamp: string;
}

export default function InternalNote({ text, author, timestamp }: Props) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-sm text-purple-600">
          lock
        </span>
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
          Internal Note
        </span>
      </div>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{text}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">{author}</span>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
}
