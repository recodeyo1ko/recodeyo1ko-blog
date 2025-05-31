const ReferenceTable = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from(Array(60).keys())
        .reduce((rows, num, idx) => {
          const rowIdx = Math.floor(idx / 30);
          if (!rows[rowIdx]) rows[rowIdx] = [];
          rows[rowIdx].push(num);
          return rows;
        }, [] as number[][])
        .map((col, colIdx) => (
          <div key={colIdx} className="border border-gray-300 p-2">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">60進数</th>
                  <th className="border border-gray-300 px-4 py-2">10進数</th>
                </tr>
              </thead>
              <tbody>
                {col.map((num) => (
                  <tr key={num}>
                    <td className="border border-gray-300 px-4 py-2">{num}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {(num / 60).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default ReferenceTable;
