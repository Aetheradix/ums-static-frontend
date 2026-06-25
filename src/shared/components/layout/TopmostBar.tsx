export default function TopmostBar() {
  return (
    <div className="topmost-bar bg-900 text-white px-4 py-2 flex align-items-center justify-content-between text-xs font-bold">
      <div className="flex gap-4 align-items-center">
        <span className="cursor-pointer hover:text-blue-400 transition-colors">
          UMS Enterprises
        </span>
        <div className="flex gap-2 text-zinc-400">
          <span className="cursor-pointer hover:text-white transition-colors">
            Help Center
          </span>
          <span className="text-zinc-600">.</span>
          <span className="cursor-pointer hover:text-white transition-colors">
            Status
          </span>
        </div>
      </div>
    </div>
  );
}
