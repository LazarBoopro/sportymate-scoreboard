export default function SelectFIeld({
  className,
  defaultValue,
  list,
}: {
  className: string;
  defaultValue: string | number;
  list: string[];
}) {
  return (
    <select className={className} defaultValue={defaultValue}>
      {Array.from({ length: 60 }).map((_, i) => (
        <option value={i}>{i + 1}</option>
      ))}
    </select>
  );
}
