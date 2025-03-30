"use client";

import CopyButton from "./CopyButton";

interface Group {
  groupName: string;
  groupCount: number;
  groupAmountPerPerson: number;
  groupTotalAmount: number;
}

interface CopyAreaProps {
  calculationMode: string;
  courseFee: number | "";
  totalBill: number | "";
  totalPeople: number | "";
  groups: Group[];
  totalGroupAmount: number;
  totalGroupCount: number;
  billMatches: boolean;
  peopleMatch: boolean;
}

const CopyArea = ({
  calculationMode,
  courseFee,
  totalBill,
  totalPeople,
  groups,
  totalGroupAmount,
  totalGroupCount,
  billMatches,
  peopleMatch,
}: CopyAreaProps) => {
  // ヘッダー部分の生成
  const headerText =
    calculationMode === "courseFee"
      ? `１人分のコース料金：${Number(
          courseFee
        ).toLocaleString()}円\n参加人数：${Number(
          totalPeople
        ).toLocaleString()}人\n請求金額：${(
          Number(courseFee) * Number(totalPeople)
        ).toLocaleString()}円`
      : `請求金額：${Number(totalBill).toLocaleString()}円\n参加人数：${Number(
          totalPeople
        ).toLocaleString()}人`;

  // 差異がある場合のメッセージを生成
  const discrepancyText: string[] = [];

  if (!billMatches) {
    const difference =
      calculationMode === "courseFee"
        ? Number(courseFee) * Number(totalPeople) - totalGroupAmount
        : Number(totalBill) - totalGroupAmount;
    if (difference !== 0) {
      const overOrShort = difference > 0 ? "少なく" : "多く";
      discrepancyText.push(
        `※請求金額に対して ${Math.abs(
          difference
        ).toLocaleString()}円 ${overOrShort}回収`
      );
    }
  }

  if (!peopleMatch) {
    const difference = totalGroupCount - Number(totalPeople);
    if (difference !== 0) {
      const overOrShort = difference > 0 ? "多く" : "少なく";
      discrepancyText.push(
        `※参加人数に対して ${Math.abs(
          difference
        ).toLocaleString()}人 ${overOrShort}参加`
      );
    }
  }

  // グループ詳細
  const groupDetails = groups
    .map(
      (group) =>
        `◇${group.groupName || "名称未設定グループ"}◇\n支払額：${Number(
          group.groupAmountPerPerson
        ).toLocaleString()}円  人数：${Number(
          group.groupCount
        ).toLocaleString()}人  合計：${Number(
          group.groupTotalAmount
        ).toLocaleString()}円\n--------------------`
    )
    .join("\n");

  // フッター部分の生成 (開業を明示)
  const footerText = `全グループ支払額合計：${totalGroupAmount.toLocaleString()}円\n全グループ人数合計：${totalGroupCount.toLocaleString()}人`;

  // コピー内容の組み立て
  const copyText = `${headerText}\n--------------------\n${groupDetails}\n${footerText}${
    discrepancyText.length > 0 ? `\n${discrepancyText.join("\n")}` : ""
  }`;

  return (
    <div className="w-full max-w-2xl">
      <textarea
        readOnly
        value={copyText}
        className="border rounded-md p-2 w-full h-48 mb-2"
      />
      <CopyButton text={copyText} />
    </div>
  );
};

export default CopyArea;
