import CommandItemRow, { CommandItem } from "./CommandItemRow";

export type CommandGroup = {
  title: string;
  description: string;
  items: CommandItem[];
};

export default function CommandGroupCard({ group }: { group: CommandGroup }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02] p-4 text-sm">
      <h3 className="text-sm font-semibold text-zinc-100">{group.title}</h3>
      <p className="mt-1 mb-3 text-xs text-zinc-500">{group.description}</p>

      <div className="space-y-2">
        {group.items.map((item, i) => (
          <CommandItemRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
