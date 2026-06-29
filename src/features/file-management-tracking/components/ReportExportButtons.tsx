import { Button } from 'shared/components/buttons';

interface Props {
  onExportCSV?: () => void;
  onCopy?: () => void;
  onExportPDF?: () => void;
}

export default function ReportExportButtons({
  onExportCSV,
  onCopy,
  onExportPDF,
}: Props) {
  return (
    <div className="flex gap-2">
      {onExportCSV && (
        <Button
          label="CSV"
          icon="file_download"
          variant="outlined"
          size="small"
          onClick={onExportCSV}
        />
      )}
      {onCopy && (
        <Button
          label="Copy"
          icon="content_copy"
          variant="outlined"
          size="small"
          onClick={onCopy}
        />
      )}
      {onExportPDF && (
        <Button
          label="PDF"
          icon="picture_as_pdf"
          variant="outlined"
          size="small"
          onClick={onExportPDF}
        />
      )}
    </div>
  );
}
