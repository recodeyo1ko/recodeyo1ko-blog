import CopyButton from "./CopyButton";

export type CommandItem = {
  label: string;
  command: string;
};

export default function CommandItemRow({ item }: { item: CommandItem }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-gray-100 bg-gray-50 p-2 text-[11px]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-700">{item.label}</span>
        <CopyButton text={item.command} />
      </div>
      <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-gray-800">
        {item.command}
      </pre>
    </div>
  );
}
