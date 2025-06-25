import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Instructions = ({handleExportAll,viewAllDocument,displayListofDocuments, templateId}) => { 
  const [highlights, setHighlights] = useState([]);
  useEffect(() => {
    if (templateId) {
      axios.get(`http://localhost:7000/api/highlights/template/${templateId}`)
        .then(res => {
          // Support both array and object with highlights array
          const data = Array.isArray(res.data) ? res.data : res.data.highlights || [];
          setHighlights(data);
        })
        .catch(() => setHighlights([]));
    }
  }, [templateId]);

  return (
    <div className="col-span-1 bg-white rounded-lg shadow-md  pt-0 h-[80vh] flex flex-col justify-between">
      <div className="bg-gray-300 rounded-t-lg rounded-b-none flex items-center justify-center p-1">
        <h2 className="font-bold mb-0 mt-0 text-center w-full">INSTRUCTIONS</h2>
      </div>
      <div className='p-6'>
        {/* Render highlights */}
        {highlights.length > 0 ? (
          <ul className="mb-4">
            {highlights.map((highlight, idx) => (
              // If highlight has nested highlights, render those labels
              Array.isArray(highlight.highlights) && highlight.highlights.length > 0 ? (
                highlight.highlights.map((h, hidx) => (
                  h.labels && h.labels.length > 0 ? (
                    h.labels.map((lbl, lidx) => (
                      <li key={`${idx}-${hidx}-${lidx}`}>{lbl.label}: {lbl.value}</li>
                    ))
                  ) : null
                ))
              ) : (
                <li key={idx}>{highlight.label}: {highlight.text}</li>
              )
            ))}
          </ul>
        ) : (
          <div className="mb-4 text-gray-500">No highlights found for this template.</div>
        )}
        <ul className="list-disc pl-5 space-y-2 flex-grow">
          <li>Please click on the + sign to add more columns/rows to the tables.</li>
          <li>Variable names can be edited by double-clicking on the name. (The allotted space will remain unchanged)</li>
          <li>Click on Generate button below to get the documents prepared using your standard format.</li>
          <li>The documents can be auto formatted in the preview window.</li>
        </ul>
      </div>
      <div className="mt-4 space-y-2 p-6">
        <button id="generateBtn" className="w-full bg-blue-600 text-white py-2 rounded rounded-lg"  onClick={handleExportAll} >Generate</button>
        <button id="exportBtn" className="w-full bg-gray-300 text-gray-700 py-2 rounded rounded-lg"  onClick={viewAllDocument} >Preview All</button>
        <button id="exportBtn" className="w-full bg-gray-300 text-gray-700 py-2 rounded rounded-lg"  onClick={displayListofDocuments} >Summary</button>
      </div>
    </div>
  );
};

export default Instructions;
