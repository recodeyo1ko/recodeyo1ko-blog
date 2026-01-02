"use client";

import { useState } from "react";
import GroupForm from "./GroupForm";
import CopyArea from "./CopyArea";
import ResultVerification from "./resultVerification";
import BasicInputForm from "./BasicInputForm";
import ToolHeader from "@/app/components/ToolHeader";

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
    <div className="mx-auto max-w-screen-2xl px-4 py-8">
      {/* タイトルと使い方 */}
      <ToolHeader
        title="飲み会計算ツール"
        description="個別情報などをマスクして、生成AIなどに安全に貼り付けるためのツールです。"
        steps={
          <>
            <li>
              <b>コース料金</b> または <b>請求金額</b> のどちらかを選択し、
              参加人数を入力します。
            </li>
            <li>
              先輩・後輩、友人・同僚など<b>複数の参加グループを追加・削除</b>
              できます。
            </li>
            <li>
              グループごとに <b>人数</b> と <b>1人あたりの支払額</b>{" "}
              を入力してください。
            </li>
            <li>
              入力内容をもとに、<b>合計金額・人数のズレ</b>{" "}
              を自動でチェックします。
            </li>
            <li>
              問題なければ、下部の <b>コピーエリア</b>{" "}
              から結果をそのまま共有できます。
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
  );
};

export default DrinkPartyOrganizerPage;
