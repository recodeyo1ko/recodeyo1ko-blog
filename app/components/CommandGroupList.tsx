import CopyButton from "./CopyButton";

export type CommandItem = {
  label: string;
  command: string;
};

export type CommandGroup = {
  title: string;
  description?: string;
  items: CommandItem[];
};

type Props = {
  groups: CommandGroup[];

  // 見た目を外から調整できるように（任意）
  className?: string;

  // コマンド表示の調整（任意）
  showCommandBlock?: boolean;
};

export default function CommandGroupList({
  groups,
  className = "",
  showCommandBlock = true,
}: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm"
        >
          <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>

          {group.description && (
            <p className="mt-1 mb-3 text-xs text-gray-500">
              {group.description}
            </p>
          )}

          <div className="space-y-2">
            {group.items.map((item) => (
              <div
                key={`${group.title}-${item.label}`} // label重複対策
                className="flex flex-col gap-1 rounded-md border border-gray-100 bg-gray-50 p-2 text-[11px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-700">
                    {item.label}
                  </span>
                  <CopyButton text={item.command} />
                </div>

                {showCommandBlock && (
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-gray-800">
                    {item.command}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
