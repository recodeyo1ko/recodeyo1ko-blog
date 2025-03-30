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
  {
    /*  整合性チェックのメッセージを生成 */
  }
  const generateMessage = () => {
    let messages: string[] = [];

    if (calculationMode === "courseFee") {
      {
        /* コース料金モード: 金額整合性チェック */
      }
      const expectedTotalAmount = Number(courseFee) * Number(totalPeople);
      if (expectedTotalAmount === totalGroupAmount) {
        messages.push("コース料金と全グループ支払額合計は一致しています。");
      } else {
        const difference = expectedTotalAmount - totalGroupAmount;
        const overOrShort = difference > 0 ? "少なく" : "多く";
        messages.push(
          `コース料金に対して ${Math.abs(
            difference
          )} 円 ${overOrShort}回収しています。`
        );
      }
    }

    if (calculationMode === "totalBill") {
      {
        /*請求金額モード: 金額整合性チェック */
      }
      if (billMatches) {
        messages.push("請求金額と全グループ支払額合計は一致しています。");
      } else {
        const difference = Number(totalBill) - totalGroupAmount;
        const overOrShort = difference > 0 ? "少なく" : "多く";
        messages.push(
          `請求金額に対して ${Math.abs(
            difference
          )} 円 ${overOrShort}回収しています。`
        );
      }
    }

    {
      /* 人数整合性チェック */
    }
    if (peopleMatch) {
      messages.push("参加人数と全グループ人数合計は一致しています。");
    } else {
      const difference = totalGroupCount - Number(totalPeople);
      const overOrShort = difference > 0 ? "多く" : "少なく";
      messages.push(
        `参加人数に対して ${Math.abs(
          difference
        )} 人 ${overOrShort}参加しています。`
      );
    }

    return messages;
  };

  const messages = generateMessage();

  return (
    <div className="border border-gray-300 p-4 rounded-lg mb-6 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">結果の照合</h2>
      <div className="space-y-2">
        {calculationMode === "courseFee" && (
          <p>
            コース料金 (1人分): {courseFee || 0} 円, 参加人数:{" "}
            {totalPeople || 0} 人
          </p>
        )}
        {calculationMode === "totalBill" && (
          <p>
            請求金額: {totalBill || 0} 円, 全グループ支払額合計:{" "}
            {totalGroupAmount} 円
          </p>
        )}
        {/* メッセージをリスト表示 */}
        <ul className="list-disc list-inside">
          {messages.map((message, index) => (
            <li
              key={index}
              className={
                message.includes("回収しています") ||
                message.includes("参加して")
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultVerification;
