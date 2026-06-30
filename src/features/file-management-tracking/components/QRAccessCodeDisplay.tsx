import { Icon } from 'shared/components/Icon/Icon';

export default function QRAccessCodeDisplay({
  fileNumber,
  qac,
}: {
  fileNumber: string;
  qac: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
      <div className="w-16 h-16 bg-white border rounded flex items-center justify-center text-gray-300">
        <Icon name="qr_code" className="text-3xl" />
      </div>
      <div>
        <p className="text-xs text-gray-500">Quick Access Code</p>
        <p className="text-sm font-mono font-bold text-gray-800">{qac}</p>
        <p className="text-xs text-gray-400">File: {fileNumber}</p>
      </div>
    </div>
  );
}
