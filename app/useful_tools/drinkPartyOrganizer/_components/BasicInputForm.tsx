"use client";

interface BasicInputFormProps {
  calculationMode: string;
  setCalculationMode: (mode: string) => void;
  courseFee: number | "";
  setCourseFee: (fee: number | "") => void;
  totalBill: number | "";
  setTotalBill: (bill: number | "") => void;
  totalPeople: number | "";
  setTotalPeople: (people: number | "") => void;
}

const BasicInputForm = ({
  calculationMode,
  setCalculationMode,
  courseFee,
  setCourseFee,
  totalBill,
  setTotalBill,
  totalPeople,
  setTotalPeople,
}: BasicInputFormProps) => {
  return (
    <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
        請求・人数情報
      </h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium text-zinc-300">計算方法:</label>
          <label className="flex items-center text-sm text-zinc-300">
            <input
              type="radio"
              value="courseFee"
              checked={calculationMode === "courseFee"}
              onChange={(e) => setCalculationMode(e.target.value)}
              className="mr-1 bg-white/[0.02] border-white/10 text-zinc-100 focus:ring-zinc-500"
            />
            コース料金から計算
          </label>
          <label className="flex items-center text-sm text-zinc-300">
            <input
              type="radio"
              value="totalBill"
              checked={calculationMode === "totalBill"}
              onChange={(e) => setCalculationMode(e.target.value)}
              className="mr-1 bg-white/[0.02] border-white/10 text-zinc-100 focus:ring-zinc-500"
            />
            請求金額から計算
          </label>
        </div>

        {calculationMode === "courseFee" && (
          <div className="flex items-center space-x-2">
            <label className="font-medium text-zinc-300 w-20">
              コース料金:
            </label>
            <input
              type="number"
              value={courseFee}
              onChange={(e) =>
                setCourseFee(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 flex-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="例: 5000"
            />
            <span className="text-zinc-500">円</span>
          </div>
        )}

        {calculationMode === "totalBill" && (
          <div className="flex items-center space-x-2">
            <label className="font-medium text-zinc-300 w-20">請求金額:</label>
            <input
              type="number"
              value={totalBill}
              onChange={(e) =>
                setTotalBill(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 flex-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="例: 25000"
            />
            <span className="text-zinc-500">円</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <label className="font-medium text-zinc-300 w-20">参加人数:</label>
          <input
            type="number"
            value={totalPeople}
            onChange={(e) =>
              setTotalPeople(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 flex-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            placeholder="例: 5"
          />
          <span className="text-zinc-500">人</span>
        </div>
      </div>
    </section>
  );
};

export default BasicInputForm;
