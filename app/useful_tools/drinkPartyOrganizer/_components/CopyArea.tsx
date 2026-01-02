"use client";

import CopyButton from "@/app/components/CopyButton";

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
  const headerText = () => {
    if (calculationMode === "courseFee") {
      return `１人分のコース料金：${Number(
        courseFee
      ).toLocaleString()}円\n参加人数：${Number(
        totalPeople
      ).toLocaleString()}人\n請求金額：${(
        Number(courseFee) * Number(totalPeople)
      ).toLocaleString()}円`;
    } else {
      return `請求金額：${Number(
        totalBill
      ).toLocaleString()}円\n参加人数：${Number(
        totalPeople
      ).toLocaleString()}人`;
    }
  };

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

  // フッター部分の生成
  const footerText = `全グループ支払額合計：${totalGroupAmount.toLocaleString()}円\n全グループ人数合計：${totalGroupCount.toLocaleString()}人`;

  // 全体のコピー用テキスト
  const fullText = `${headerText()}\n--------------------\n${groupDetails}\n${footerText}${
    discrepancyText.length > 0 ? "\n" + discrepancyText.join("\n") : ""
  }`;

  return (
    <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
        コピーエリア
      </h2>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">
          計算結果をコピーして共有できます。
        </p>
        <CopyButton text={fullText} />
      </div>
      <textarea
        value={fullText}
        readOnly
        className="w-full h-64 bg-white/[0.02] border border-white/10 rounded-md p-3 text-sm font-mono text-zinc-100"
        onFocus={(e) => e.target.select()}
      />
    </section>
  );
};

export default CopyArea;
