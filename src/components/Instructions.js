import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Instructions = ({ handleExportAll, viewAllDocument, displayListofDocuments, templateId, projectId }) => {
  const [highlights, setHighlights] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const urlTemplateId = params.templateId || params.id;

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

  const handleProceed = async (e) => {
    e.preventDefault();
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }
    if (!templateId) {
      toast.error("Please select a template");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:7000/api/project/${projectId}/templates/${templateId}`);
      if (!response.ok) throw new Error("Failed to fetch template data");
      const data = response.data;
      // Now open Instruction.js and pass the highlights/fields
      // For example, if using React Router:
      navigate('/instructions', { state: { highlights: data.highlights, templateId, projectId } });
    } catch (error) {
      toast.error("Failed to fetch template data.");
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    const id = templateId || urlTemplateId;
    if (!id) {
      toast.error("No template selected for generation.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:7000/api/templates/${id}/download`,
        { responseType: 'blob', withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated-document.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded!');
    } catch (error) {
      toast.error('Failed to download document.');
      console.error(error);
    }
  };

  const handlePreview = async () => {
    const id = templateId || urlTemplateId;
    if (!id) {
      toast.error("No template selected for preview.");
      return;
    }
    try {
      // Fetch template data before navigating
      const response = await axios.get(`http://localhost:7000/api/templates/${id}`);
      const templateData = response.data;
      // Optionally, pass templateData as state if needed
      navigate(`/document/${id}`, { state: { templateData } });
    } catch (error) {
      toast.error('Failed to fetch template data for preview.');
      console.error(error);
    }
  };

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
          <div className="mb-4 text-gray-500"></div>
        )}
        <ul className="list-disc pl-5 space-y-2 flex-grow">
         
        </ul>
      </div>
      <div className="mt-4 space-y-2 p-6">
        <button
          type="button"
          onClick={handleGenerate}
          className="bg-indigo-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded"
        >
          Generate
        </button>
        <button
          type="button"
          className="w-full bg-gray-300 text-gray-700 py-2 rounded rounded-lg"
          onClick={handlePreview}
        >
          Preview
        </button>
        <button
          type="button"
          className="w-full bg-gray-300 text-gray-700 py-2 rounded rounded-lg"
          onClick={displayListofDocuments}
        >
          Summary
        </button>
      </div>
    </div>
  );
};

export default Instructions;