export default function Footer() {
  return (
    <div className="footer-bar bg-900 text-white px-4 py-3 flex align-items-center justify-content-between text-xs font-medium">
      <div className="text-zinc-400">
        © 2026 UMS Systems - Enterprise Operating System
      </div>
      <div className="flex gap-4 text-zinc-400">
        <span className="cursor-pointer hover:text-white transition-colors">
          Privacy
        </span>
        <span className="cursor-pointer hover:text-white transition-colors">
          Terms
        </span>
        <span className="cursor-pointer hover:text-white transition-colors">
          Status
        </span>
      </div>
    </div>
  );
}
