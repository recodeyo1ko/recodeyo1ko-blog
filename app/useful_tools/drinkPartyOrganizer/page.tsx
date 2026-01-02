"use client";

import { useState } from "react";
import GroupForm from "./_components/GroupForm";
import CopyArea from "./_components/CopyArea";
import ResultVerification from "./_components/resultVerification";
import BasicInputForm from "./_components/BasicInputForm";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

interface Group {
  groupName: string;
  groupCount: number;
  groupAmountPerPerson: number;
  groupTotalAmount: number;
}

const DrinkPartyOrganizerPage = () => {
  const [calculationMode, setCalculationMode] = useState("courseFee"); // "courseFee" or "totalBill"
  const [courseFee, setCourseFee] = useState<number | "">("");
  const [totalBill, setTotalBill] = useState<number | "">("");
  const [totalPeople, setTotalPeople] = useState<number | "">("");
  const [groups, setGroups] = useState<Group[]>([
    {
      groupName: "",
      groupCount: 0,
      groupAmountPerPerson: 0,
      groupTotalAmount: 0,
    },
  ]);

  const addGroup = () => {
    setGroups((prevGroups) => [
      ...prevGroups,
      {
        groupName: "",
        groupCount: 0,
        groupAmountPerPerson: 0,
        groupTotalAmount: 0,
      },
    ]);
  };

  const removeGroup = (index: number) => {
    if (groups.length > 1) {
      const newGroups = [...groups];
      newGroups.splice(index, 1);
      setGroups(newGroups);
    }
  };

  const calculateTotals = () => {
    const totalGroupCount = groups.reduce(
      (sum, group) => sum + group.groupCount,
      0
    );
    const totalGroupAmount = groups.reduce(
      (sum, group) => sum + group.groupCount * group.groupAmountPerPerson,
      0
    );

    return {
      totalGroupCount,
      totalGroupAmount,
      billMatches: Number(totalBill) === totalGroupAmount,
      peopleMatch: Number(totalPeople) === totalGroupCount,
    };
  };

  const { totalGroupCount, totalGroupAmount, billMatches, peopleMatch } =
    calculateTotals();

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="飲み会幹事お会計"
          description="飲み会の幹事さん向けに、コース料金または総額から各グループのお会計を自動計算します。グループごとの人数と一人当たり金額を入力するだけで、合計金額と人数の照合も行います。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>請求方法を「コース料金」または「総額」から選択します。</li>
              <li>
                選択した請求方法に応じて、コース料金または総額と参加人数を入力します。
              </li>
              <li>
                各グループの名前、人数、一人当たりの金額を入力します。必要に応じてグループを追加・削除できます。
              </li>
              <li>
                入力が完了したら、各グループの合計金額と人数が全体の請求額と人数と一致しているか確認します。
              </li>
              <li>
                確認が取れたら、下部のコピーエリアからお会計情報をコピーして共有できます。
              </li>
            </>
          }
        />

        {/* 請求・人数情報 */}
        <BasicInputForm
          calculationMode={calculationMode}
          setCalculationMode={setCalculationMode}
          courseFee={courseFee}
          setCourseFee={setCourseFee}
          totalBill={totalBill}
          setTotalBill={setTotalBill}
          totalPeople={totalPeople}
          setTotalPeople={setTotalPeople}
        />

        {/* グループ情報 */}
        <GroupForm
          groups={groups}
          setGroups={setGroups}
          addGroup={addGroup}
          removeGroup={removeGroup}
        />

        {/* 結果の照合 */}
        <ResultVerification
          calculationMode={calculationMode}
          courseFee={courseFee}
          totalBill={totalBill}
          totalPeople={totalPeople}
          totalGroupAmount={totalGroupAmount}
          totalGroupCount={totalGroupCount}
          billMatches={billMatches}
          peopleMatch={peopleMatch}
        />

        {/* コピーエリア */}
        <CopyArea
          calculationMode={calculationMode}
          courseFee={courseFee}
          totalBill={totalBill}
          totalPeople={totalPeople}
          groups={groups}
          totalGroupAmount={totalGroupAmount}
          totalGroupCount={totalGroupCount}
          billMatches={billMatches}
          peopleMatch={peopleMatch}
        />
      </div>
    </div>
  );
};

export default DrinkPartyOrganizerPage;
