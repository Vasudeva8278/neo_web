import React, { useState, useEffect, useRef } from 'react';

const DynamicTable = ({ initialTableHtml, setNewText, handleSaveTable }) => {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(initialTableHtml, 'text/html');
    const table = doc.querySelector('table');
    if (table) {
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');

      if (thead) {
        const headerRow = thead.querySelector('tr');
        if (headerRow) {
          const parsedHeaders = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
          setHeaders(parsedHeaders);
        }
      }

      if (tbody) {
        const parsedRows = Array.from(tbody.querySelectorAll('tr')).map(tr =>
          Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
        );
        setRows(parsedRows);
      }
    }
  }, [initialTableHtml]);

  const addRow = () => {
    setRows([...rows, Array(headers.length).fill('')]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const addColumn = () => {
    const newColumnName = `Column ${headers.length + 1}`;
    setHeaders([...headers, newColumnName]);
    setRows(rows.map(row => [...row, '']));
  };

  const removeColumn = (colIndex) => {
    if (headers.length <= 1) {
      alert("Cannot remove the last column.");
      return;
    }
  
    const newHeaders = [...headers];
    const newRows = rows.map(row => [...row]);
  
    newHeaders.splice(colIndex, 1);
    newRows.forEach(row => row.splice(colIndex, 1));
  
    setHeaders(newHeaders);
    setRows(newRows);
  };
  

  const handleCellChange = (e, rowIndex, colIndex) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = e.target.innerText;
    setRows(newRows);
  };

  const handleHeaderChange = (e, colIndex) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = e.target.innerText;
    setHeaders(newHeaders);
  };
  
  const handleOutsideClick = (event) => {
    const dynamicTable = document.getElementById('dynamicTable');
    if (dynamicTable && !dynamicTable.contains(event.target)) {
        handleSaveTable(
        document.getElementById('dynamicTable')?.innerHTML
      );
    }
  };

  useEffect(() => {
    const tableHtml = `
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400" contenteditable="true">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            ${headers.map(header => `<th scope="col" class="px-6 py-3">${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              ${row.map(cell => `<td class="px-6 py-4">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    setNewText(tableHtml);
  }, [headers, rows, setNewText]);

  return (
    <div id="dynamicTable" className="p-4 bg-gray-50 rounded-lg shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Table</h2>
        <div className="space-x-2">
          <button onClick={addRow} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Add Row
          </button>
          <button onClick={addColumn} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Add Column
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" onMouseLeave={handleOutsideClick}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header, colIndex) => (
              <th key={colIndex} className="border p-2" contentEditable onBlur={e => handleHeaderChange(e, colIndex)}>
                {header}
                <button onClick={() => removeColumn(colIndex)} className="ml-2 text-red-500">
                  &times;
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border p-2" contentEditable onBlur={e => handleCellChange(e, rowIndex, colIndex)}>
                  {cell}
                </td>
              ))}
              <td className="border p-2">
                <button onClick={() => removeRow(rowIndex)} className="text-red-500">
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;