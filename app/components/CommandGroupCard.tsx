import CommandItemRow, { CommandItem } from "./CommandItemRow";

export type CommandGroup = {
  title: string;
  description: string;
  items: CommandItem[];
};

export default function CommandGroupCard({ group }: { group: CommandGroup }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>
      <p className="mt-1 mb-3 text-xs text-gray-500">{group.description}</p>

      <div className="space-y-2">
        {group.items.map((item, i) => (
          <CommandItemRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
