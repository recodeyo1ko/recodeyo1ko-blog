"use client";

interface ResultVerificationProps {
  calculationMode: string;
  courseFee: number | "";
  totalBill: number | "";
  totalPeople: number | "";
  totalGroupAmount: number;
  totalGroupCount: number;
  billMatches: boolean;
  peopleMatch: boolean;
}

const ResultVerification = ({
  calculationMode,
  courseFee,
  totalBill,
  totalPeople,
  totalGroupAmount,
  totalGroupCount,
  billMatches,
  peopleMatch,
}: ResultVerificationProps) => {
  // 整合性チェックのメッセージを生成
  const generateMessage = () => {
    let messages: string[] = [];

    if (calculationMode === "courseFee") {
      // コース料金モード: 金額整合性チェック
      const expectedTotalAmount = Number(courseFee) * Number(totalPeople);
      if (expectedTotalAmount === totalGroupAmount) {
        messages.push("✅ 金額が一致しています。");
      } else {
        const diff = totalGroupAmount - expectedTotalAmount;
        messages.push(
          `⚠️ 請求金額に対して ${Math.abs(diff)}円 ${
            diff > 0 ? "多く" : "少なく"
          }回収`
        );
      }
    }

    if (calculationMode === "totalBill") {
      // 請求金額モード: 金額整合性チェック
      if (billMatches) {
        messages.push("✅ 金額が一致しています。");
      } else {
        const diff = totalGroupAmount - Number(totalBill);
        messages.push(
          `⚠️ 請求金額に対して ${Math.abs(diff)}円 ${
            diff > 0 ? "多く" : "少なく"
          }回収`
        );
      }
    }

    // 人数整合性チェック
    if (peopleMatch) {
      messages.push("✅ 人数が一致しています。");
    } else {
      const diff = totalGroupCount - Number(totalPeople);
      messages.push(
        `⚠️ 参加人数に対して ${Math.abs(diff)}人 ${
          diff > 0 ? "多く" : "少なく"
        }参加`
      );
    }

    return messages;
  };

  const messages = generateMessage();

  return (
    <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">結果の照合</h2>
      <div className="space-y-2">
        {messages.map((message, index) => (
          <p key={index} className="text-sm text-zinc-300">
            {message}
          </p>
        ))}
      </div>
    </section>
  );
};

export default ResultVerification;
