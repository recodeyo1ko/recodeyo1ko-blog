"use client";

import { useState } from "react";
import GroupForm from "./GroupForm";
import CopyArea from "./CopyArea";
import ResultVerification from "./resultVerification";
import BasicInputForm from "./BasicInputForm";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">飲み会計算ツール</h1>

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
  );
};

export default DrinkPartyOrganizerPage;
