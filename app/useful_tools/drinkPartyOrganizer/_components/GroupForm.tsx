"use client";

interface Group {
  groupName: string;
  groupCount: number;
  groupAmountPerPerson: number;
  groupTotalAmount: number;
}

interface GroupFormProps {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: () => void;
  removeGroup: (index: number) => void;
}

const GroupForm = ({
  groups,
  setGroups,
  addGroup,
  removeGroup,
}: GroupFormProps) => {
  const updateGroup = (
    index: number,
    field: keyof Group,
    value: string | number
  ) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    // 合計金額を自動計算
    if (field === "groupCount" || field === "groupAmountPerPerson") {
      newGroups[index].groupTotalAmount =
        newGroups[index].groupCount * newGroups[index].groupAmountPerPerson;
    }
    setGroups(newGroups);
  };

  return (
    <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-zinc-100">グループ情報</h2>
        <button
          onClick={addGroup}
          className="px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          + グループ追加
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group, index) => (
          <div
            key={index}
            className="bg-white/[0.02] rounded-md border border-white/10 p-4 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-zinc-300">
                グループ {index + 1}
              </span>
              {groups.length > 1 && (
                <button
                  onClick={() => removeGroup(index)}
                  className="text-xs text-red-400 hover:underline"
                >
                  削除
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  グループ名
                </label>
                <input
                  type="text"
                  value={group.groupName}
                  onChange={(e) =>
                    updateGroup(index, "groupName", e.target.value)
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder="例: 先輩グループ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  人数
                </label>
                <input
                  type="number"
                  value={group.groupCount}
                  onChange={(e) =>
                    updateGroup(index, "groupCount", Number(e.target.value))
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder="例: 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  1人あたりの支払額
                </label>
                <input
                  type="number"
                  value={group.groupAmountPerPerson}
                  onChange={(e) =>
                    updateGroup(
                      index,
                      "groupAmountPerPerson",
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder="例: 5000"
                />
              </div>
            </div>

            <div className="mt-2 text-sm text-zinc-500">
              合計: {group.groupTotalAmount}円
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GroupForm;
