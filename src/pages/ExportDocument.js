import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getTemplatesById, saveHighlights } from '../services/templateApi';
import { getHighlightsByTemplateId } from '../services/highlightsApi';
import { addNewDocument, getDocumentsWithTemplateNames } from '../services/documentApi'; 
import NeoModal from '../components/NeoModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocumentsWithTemplateNames } from '../redux/slice/documentSlice';
import axios from 'axios';

const ExportDocument = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('projectId');

  const [template, setTemplate] = useState(null);
  const [variableDefs, setVariableDefs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variables, setVariables] = useState([]);
  const [highlightDefs, setHighlightDefs] = useState([]);

  const dispatch = useDispatch();
  const { documents: reduxDocuments, status, error } = useSelector(state => state.documents);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templateData = await getTemplatesById(templateId);
        setTemplate(templateData);

        const highlightsResponse = await getHighlightsByTemplateId(templateId);
        const highlightsData = (highlightsResponse.data || []).map(h => ({
          label: h.label,
          placeholder: h.text,
        }));
        setVariableDefs(highlightsData);

        const initialValues = {};
        highlightsData.forEach(h => { initialValues[h.label] = '' });
        
        setDocuments([{
          id: uuidv4(),
          name: 'DocName1',
          values: initialValues,
        }]);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load template data.");
      }
    };

    if (templateId) {
      fetchData();
    }
  }, [templateId]);
  
  useEffect(() => {
    const fetchHighlightData = async () => {
      if (templateId) {
        try {
          const res = await axios.get(`http://localhost:7000/api/highlights/template/${templateId}`);
          console.log("Highlight API response:", res.data);
          // Use res.data.data for the highlights array
          const data = Array.isArray(res.data.data) ? res.data.data : [];
          let flatHighlights = [];
          data.forEach(h => {
            if (Array.isArray(h.labels) && h.labels.length > 0) {
              h.labels.forEach(lbl => {
                flatHighlights.push({ label: lbl.label, value: lbl.value });
              });
            } else if (h.label) {
              flatHighlights.push({ label: h.label, value: h.text });
            }
          });
          setHighlightDefs(flatHighlights);
        } catch (e) {
          setHighlightDefs([]);
        }
      }
    };
    fetchHighlightData();
  }, [templateId]);

  const handleAddDocument = () => {
    const newDocValues = {};
    variableDefs.forEach(h => { newDocValues[h.label] = ''; });
    const newDoc = {
      id: uuidv4(),
      name: `DocName${documents.length + 1}`,
      values: newDocValues,
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleRemoveDocument = (docId) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  const handleDocNameChange = (docId, newName) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === docId ? { ...doc, name: newName } : doc
    ));
  };
  
  const handleValueChange = (docId, label, value) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, values: { ...doc.values, [label]: value } };
      }
      return doc;
    }));
  };

  const handlePreview = () => navigate(`/document/${templateId}`);
  
  const getFinalContentForDoc = (doc) => {
    let content = template.content;
    variableDefs.forEach(varDef => {
        const value = doc.values[varDef.label] || '';
        // Use a global regex to replace all occurrences of the placeholder
        const regex = new RegExp(varDef.placeholder, 'g');
        content = content.replace(regex, value);
    });
    return content;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Generating document...");

    if (!highlightDefs || highlightDefs.length === 0) {
      toast.error("No highlights to save. Please fill in the fields.");
      return;
    }

    if (!variables || variables.length === 0) {
      toast.error("No variables to save. Please fill in the fields.");
      return;
    }

    for (const doc of documents) {
      try {
        // Step 1: Generate and download the file (no backend save)
        const finalContent = getFinalContentForDoc(doc);
        const blob = new Blob([finalContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${doc.name}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success(`Document "${doc.name}" downloaded successfully!`);
      } catch (error) {
        console.error(`Failed to generate document "${doc.name}":`, error);
        toast.error(`Failed to generate document "${doc.name}".`);
      }
    }

    setIsGenerating(false);
  };

  const handleInputChange = (index, value) => {
    setVariables(prev =>
      prev.map((v, i) => i === index ? { ...v, text: value } : v)
    );
  };

  useEffect(() => {
    dispatch(fetchDocumentsWithTemplateNames());
  }, [dispatch]);

  if (!template) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{template.fileName}</h1>
            <div className="flex space-x-2">
              <button onClick={handlePreview} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Preview</button>
              <button onClick={handleGenerate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
              <button onClick={() => setIsSummaryOpen(true)} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Summary</button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="sticky left-0 bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700 z-10 w-64">
                    <div className='flex items-center gap-4'>
                      Variable Name vasu
                    </div>
                  </th>
                  {documents.map((doc, index) => (
                    <th key={doc.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[250px]">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => handleDocNameChange(doc.id, e.target.value)}
                          className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        />
                        {documents.length > 1 && (
                          <button onClick={() => handleRemoveDocument(doc.id)} className="text-red-500 hover:text-red-700 font-medium whitespace-nowrap">&mdash; Remove</button>
                        )}
                        {index === documents.length -1 && <button onClick={handleAddDocument} className="text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap">&#43; Add</button>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {highlightDefs.map((varDef, index) => (
                  <tr key={varDef.label}>
                    <td className="sticky left-0 bg-white px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-800 w-64">
                      {varDef.label}
                    </td>
                    {documents.map((doc, docIndex) => (
                      <td key={doc.id} className="px-4 py-3 border-b border-gray-200">
                        <input
                          type="text"
                          value={doc.values[varDef.label] || ''}
                          onChange={(e) => handleValueChange(doc.id, varDef.label, e.target.value)}
                          className="w-full block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <NeoModal isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p>The summary for multiple documents is not yet implemented.</p>
        </div>
      </NeoModal>
    </>
  );
};

export default ExportDocument; 