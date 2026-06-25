export default function ProfileInfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="my-profile-info-row">
      <span className="my-profile-info-label">{label}</span>
      <span className="my-profile-info-colon">:</span>
      <strong className="my-profile-info-value">{value}</strong>
    </div>
  );
}
