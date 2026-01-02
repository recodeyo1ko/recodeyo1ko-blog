import CopyButton from "../CopyButton";

export type CommandItem = {
  label: string;
  command: string;
};

export default function CommandItemRow({ item }: { item: CommandItem }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-white/10 bg-white/[0.02] p-2 text-[11px] hover:bg-white/[0.05]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-zinc-100">{item.label}</span>
        <CopyButton text={item.command} />
      </div>
      <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-zinc-300">
        {item.command}
      </pre>
    </div>
  );
}
