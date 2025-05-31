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
  // 色のリストを用意
  const backgroundColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-purple-100",
  ];

  return (
    <div className="border border-gray-300 p-4 rounded-lg mb-6 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">グループ情報</h2>
      {groups.map((group, index) => (
        <div
          key={index}
          className={`border-b pb-4 mb-4 rounded-md p-4 ${
            backgroundColors[index % backgroundColors.length]
          }`}
        >
          {/* グループ情報フォーム */}
          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1">
              グループ名：
            </label>
            <input
              type="text"
              value={group.groupName}
              onChange={(e) => {
                const newGroups = [...groups];
                newGroups[index].groupName = e.target.value;
                setGroups(newGroups);
              }}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1">
              グループ人数：
            </label>
            <div className="flex items-center">
              <input
                type="number"
                placeholder="1"
                value={group.groupCount}
                onChange={(e) => {
                  const newGroups = [...groups];
                  newGroups[index].groupCount = Number(e.target.value);
                  newGroups[index].groupTotalAmount =
                    newGroups[index].groupCount *
                    newGroups[index].groupAmountPerPerson;
                  setGroups(newGroups);
                }}
                className="border rounded-md px-2 py-1 flex-grow"
              />
              <span className="ml-2">人</span>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1">
              グループ支払額（1人分）：
            </label>
            <div className="flex items-center">
              <input
                type="number"
                placeholder="0"
                value={group.groupAmountPerPerson}
                onChange={(e) => {
                  const newGroups = [...groups];
                  newGroups[index].groupAmountPerPerson = Number(
                    e.target.value
                  );
                  newGroups[index].groupTotalAmount =
                    newGroups[index].groupCount *
                    newGroups[index].groupAmountPerPerson;
                  setGroups(newGroups);
                }}
                className="border rounded-md px-2 py-1 flex-grow"
              />
              <span className="ml-2">円</span>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1">
              グループ支払額合計：
            </label>
            <div>
              <span className="text-lg font-semibold">
                {group.groupTotalAmount || 0}
              </span>
              <span className="ml-2">円</span>
            </div>
          </div>

          {/* 削除ボタン */}
          <div className="flex justify-end">
            <button
              onClick={() => removeGroup(index)}
              disabled={groups.length <= 1} // グループが1つ以下の場合は無効化
              className={`px-4 py-2 rounded-md ${
                groups.length > 1
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              削除
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addGroup}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
      >
        追加
      </button>
    </div>
  );
};

export default GroupForm;
