import React, { useState, useEffect } from 'react';

export default function useTableData(headings, data) {
  const [tradeList, setTradeList] = useState(data);
  const [dataForTable, setDataForTable] = useState(null);

  useEffect(() => {
    if (tradeList) {
      let trades = [];
      for (const trade of tradeList) {
        let tableTrade = {};
        for (const heading of headings) {
          tableTrade[heading.field] = trade[heading.field];
        }
        trades.push(tableTrade);
      }
      setDataForTable({ columns: headings, data: trades });
    }
  }, [tradeList]);

  return [dataForTable, setTradeList];
}
