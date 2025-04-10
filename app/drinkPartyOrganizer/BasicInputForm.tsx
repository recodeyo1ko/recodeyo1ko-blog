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
    <div className="border border-gray-300 p-4 rounded-lg mb-6 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">請求・人数情報</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium">計算方法:</label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="calculationMode"
              value="courseFee"
              checked={calculationMode === "courseFee"}
              onChange={() => {
                setCalculationMode("courseFee");
                setTotalBill("");
              }}
            />
            <span>コース料金 (1人分)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="calculationMode"
              value="totalBill"
              checked={calculationMode === "totalBill"}
              onChange={() => {
                setCalculationMode("totalBill");
                setCourseFee("");
              }}
            />
            <span>請求金額</span>
          </label>
        </div>

        {calculationMode === "courseFee" && (
          <>
            <div className="flex items-center space-x-2">
              <label htmlFor="courseFee" className="font-medium">
                コース料金 (1人分):
              </label>
              <input
                type="number"
                id="courseFee"
                value={courseFee}
                onChange={(e) =>
                  setCourseFee(
                    e.target.value !== "" ? Number(e.target.value) : ""
                  )
                }
                className="border rounded-md px-2 py-1 w-full"
                placeholder="例: 5000"
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <label htmlFor="totalPeople" className="font-medium">
                参加人数:
              </label>
              <input
                type="number"
                id="totalPeople"
                value={totalPeople}
                onChange={(e) =>
                  setTotalPeople(
                    e.target.value !== "" ? Number(e.target.value) : ""
                  )
                }
                className="border rounded-md px-2 py-1 w-full"
                placeholder="例: 4"
              />
            </div>
          </>
        )}

        {calculationMode === "totalBill" && (
          <>
            <div className="flex items-center space-x-2">
              <label htmlFor="totalBill" className="font-medium">
                請求金額:
              </label>
              <input
                type="number"
                id="totalBill"
                value={totalBill}
                onChange={(e) =>
                  setTotalBill(
                    e.target.value !== "" ? Number(e.target.value) : ""
                  )
                }
                className="border rounded-md px-2 py-1 w-full"
                placeholder="例: 20000"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="totalPeople" className="font-medium">
                参加人数:
              </label>
              <input
                type="number"
                id="totalPeople"
                value={totalPeople}
                onChange={(e) =>
                  setTotalPeople(
                    e.target.value !== "" ? Number(e.target.value) : ""
                  )
                }
                className="border rounded-md px-2 py-1 w-full"
                placeholder="例: 4"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BasicInputForm;
