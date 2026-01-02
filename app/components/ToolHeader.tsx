type Props = {
  title: string;
  description?: string;
  steps?: React.ReactNode; // <li> を渡す
  className?: string;
};

export default function ToolHeader({
  title,
  description,
  steps,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <h1 className="mb-2 text-2xl font-bold text-gray-800">{title}</h1>

      {description && (
        <p className="mb-4 text-sm text-gray-600">{description}</p>
      )}

      {steps && (
        <div className="mb-6 rounded-md border border-blue-300 bg-blue-50 px-3 py-3 text-xs text-blue-800">
          <p className="mb-1 font-semibold">使い方</p>
          <ul className="list-disc list-inside pl-5 space-y-1">{steps}</ul>
        </div>
      )}
    </div>
  );
}
