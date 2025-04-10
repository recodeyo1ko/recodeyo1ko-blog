"use client";
import Conversion from "./Conversion";
import ReferenceTable from "./ReferenceTable";

const DecimalConversionPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">60進数⇔10進数変換</h1>
      <Conversion />
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-bold mb-4">参考: 60進数と10進数の対応表</h2>
        <ReferenceTable />
      </div>
    </div>
  );
};

export default DecimalConversionPage;
