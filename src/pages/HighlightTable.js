import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Instructions from "../components/Instructions";
import axios from "axios";
import {
  PlusCircleIcon,
  DownloadIcon,
  ArrowLeftIcon,
  ViewBoardsIcon,
  EyeIcon,
  TrashIcon,
  MinusIcon,
} from "@heroicons/react/outline";
import { v4 as uuidv4 } from "uuid";
import imageIcon from "../Assets/image.png";
import tableIcon from "../Assets/table.png";
import DocumentHighlightsModal from "../components/Documents/DocumentHighlightsModal";
import { ViewListIcon } from "@heroicons/react/solid";
import TableHeader from "../components/TableHeader";
import { FaArrowRight } from "react-icons/fa";
import {
  ArrowLeft,
  Search,
  Eye,
  HelpCircle,
  Plus,
  Maximize2,
} from "lucide-react";

import {
  addNewDocument,
  deleteDocument,
  exportDocument,
  generateZipFile,
  getDocumentsListByTemplateId,
  updateDocHighlightText,
} from "../services/documentApi";
import { getTemplateById, getAllTemplates } from '../services/templateApi';
import TooltipIcon from "../components/TooltipIcon";
import FileCarousel from "../components/FileCarousel";
import Carousel from "../components/FileCarousel";
import { getHighlightsByTemplateId, updateHighlight } from '../services/highlightsApi';

const HighlightTable = ({
  highlightsArray,
  templateId,
  filename,
  projectId,
}) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlight, setHighlight] = useState("");
  const [msDocument, setMsDocument] = useState("");
  const [rowNo, setRowNo] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [currentDoc, setCurrentDoc] = useState("");
  const [conversionStatus, setConversionStatus] = useState("");
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [templateName, setTemplateName] = useState("");

  const location = useLocation(); // Gives you access to the current URL including the query string
  const queryParams = new URLSearchParams(location.search);
  // const projectId = queryParams.get("projectId");

  console.log(templateId, filename);
  const fetchData = async () => {
    if (highlightsArray && highlightsArray.length > 0) {
      // If highlightsArray is passed, use it to populate the table for a new document
      const newDoc = {
        id: uuidv4(),
        templateId,
        fileName: "DocName1",
        highlights: highlightsArray,
      };
      setTableData([newDoc]);
      setMsDocument([newDoc]);
      const items = [{
        id: newDoc.id,
        image: null,
        title: newDoc.fileName,
        description: (newDoc.highlights || [])
          .filter((highlight) => highlight.type === "text")
          .map((highlight) => highlight.text)
          .join(" "),
      }];
      setItems(items);
    } else {
      // Otherwise, fetch existing documents for the template
      try {
        const response = getDocumentsListByTemplateId(projectId, templateId);
        setTemplateName(response?.templateName || "Template");
        const data = response?.documents || [];
        setMsDocument(data);

        const items = data.map((item) => ({
          id: item._id,
          image: item?.thumbnail,
          title: item.fileName,
          description: (item.highlights || [])
            .filter((highlight) => highlight.type === "text")
            .map((highlight) => highlight.text)
            .join(" "),
        }));

        setItems(items);
        setTableData(data);
      } catch (error) {
        console.error("Failed to fetch and process highlight table data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchHighlights = async () => {
      if (!highlightsArray && templateId) {
        try {
          const data = await getHighlightsByTemplateId(templateId);
          // If the API returns an array of highlight objects, use as is
          // If it returns an object with a 'highlights' array, use that
          const highlights = Array.isArray(data) ? data : data.highlights || [];
          const newDoc = {
            id: uuidv4(),
            templateId,
            fileName: filename || 'DocName1',
            highlights: highlights,
          };
          setTableData([newDoc]);
          setMsDocument([newDoc]);
          const items = [{
            id: newDoc.id,
            image: null,
            title: newDoc.fileName,
            description: (newDoc.highlights || [])
              .filter((highlight) => highlight.type === 'text')
              .map((highlight) => highlight.text)
              .join(' '),
          }];
          setItems(items);
        } catch (error) {
          console.error('Failed to fetch highlights by templateId:', error);
        }
      } else {
        fetchData();
      }
    };
    fetchHighlights();
    // eslint-disable-next-line
  }, [templateId, highlightsArray]);

  const viewAllDocument = async () => {
    try {
      const templates = await getAllTemplates();
      if (templates && templates.length > 0) {
        const templateIds = templates.map((t) => t._id);
        const firstTemplateId = templateIds[0];
        navigate(`/template/${firstTemplateId}`, {
          state: { templateIds, currentIndex: 0, projectId },
        });
      } else {
        alert("No templates found for this project.");
      }
    } catch (error) {
      console.error("Failed to fetch templates for preview", error);
      alert("Failed to load templates for preview.");
    }
  };
  const handleInputChange = (value, docIdx, varIdx) => {
    setMsDocument(prev => {
      const updated = [...prev];
      updated[docIdx] = {
        ...updated[docIdx],
        highlights: updated[docIdx].highlights.map((h, i) =>
          i === varIdx ? { ...h, text: value } : h
        ),
      };
      return updated;
    });
  };

  const handleDeleteDocument = async (doc) => {
    const doc_id = doc.id ? doc.id : doc._id;
    console.log("deleteing document", doc_id);
    const response = await deleteDocument(projectId, doc_id);
    if (response) {
      fetchData();
    }
  };
  const handleViewDocument = async (doc) => {
    if (!doc) return;
    const doc_id = doc._id || doc.id;
    const allDocIds = msDocument.map((d) => d._id);
    const currentDocIndex = msDocument.findIndex((d) => d._id === doc_id);

    if (currentDocIndex !== -1) {
      navigate(`/docview/${doc_id}`, {
        state: { documentIds: allDocIds, currentIndex: currentDocIndex },
      });
    } else {
      navigate(`/docview/${doc_id}`);
    }
  };

  const displayListofDocuments = async () => {
    console.log("list of all document");
    navigate(`/listview`, { state: { data: tableData } });
  };

  const changeImage = (event, rowIndex, cellIndex) => {
    setIsModalOpen(true);
    //console.log(tableData[rowIndex].highlights[cellIndex]);
    setHighlight(tableData[rowIndex].highlights[cellIndex]);
    //console.log(tableData[rowIndex]);
    setCurrentDoc(tableData[rowIndex]);
    setRowNo(rowIndex);
    setCellNo(cellIndex);
  };

  const saveTableOrImage = async (value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowNo].highlights[cellNo].text = value;
    const updatedRow = updatedTableData[rowNo];
    const updatedHighlight = updatedTableData[rowNo].highlights[cellNo];
    //  updatedRow.content = await editDocumentContent(conversionStatus,updatedHighlight)
    console.log(updatedRow);
    const doc_id = updatedRow.id ? updatedRow.id : updatedRow._id;
    const response = await updateDocHighlightText(doc_id, updatedRow);
    if (response) fetchData();
  };

  const handleBlur = async (rowIndex, cellIndex) => {
    const updatedRow = tableData[rowIndex];
    const updatedHighlight = updatedRow.highlights[cellIndex];
    // updatedRow.content = await editDocumentContent(conversionStatus,updatedHighlight)
    console.log(updatedRow);
    const doc_id = updatedRow.id ? updatedRow.id : updatedRow._id;
    const response = await updateDocHighlightText(doc_id, updatedRow);
    console.log(response);
    //setTableData([...tableData]);
    fetchData();
    // }
  };

  const handleBack = () => {
    navigate("/Neo");
  };

  const handleExportTemplate = (row) => {
    handleExport(templateId, row);
  };

  const handleExport = async (row) => {
    try {
      const response = exportDocument(row._id);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", row.fileName.trim() + ".docx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleDocument = (rowIndex, cellIndex) => {
    setConversionStatus(tableData[rowIndex].content);
  };

  const handleAddRow = () => {
    let blueprint = highlightsArray || (msDocument[0]?.highlights ?? []);
    if (!blueprint.length) {
      alert("No template structure available to add a new document.");
      return;
    }
    const newDoc = {
      id: uuidv4(),
      templateId,
      fileName: "DocName" + (msDocument.length + 1),
      highlights: blueprint.map(cell => ({
        ...cell,
        text: "", // empty for new row
      })),
    };
    setTableData(prev => [...prev, newDoc]);
    setMsDocument(prev => [...prev, newDoc]);
    setItems(prev => [
      ...prev,
      {
        id: newDoc.id,
        image: null,
        title: newDoc.fileName,
        description: (newDoc.highlights || [])
          .filter(h => h.type === "text")
          .map(h => h.text)
          .join(" "),
      },
    ]);
  };
  const handleExportAll = async (event) => {
    event.preventDefault();
    const documentIds = (msDocument || []).map((doc) => doc._id);
    if(documentIds.length === 0){
      alert("No documents to export");
      return;
    }
    const documentData = {
      documentIds,
      folderName: filename,
      templateId,
      projectId,
    };
    try {
      setIsLoading(true);
      await generateZipFile(documentData, filename);
    } catch (error) {
      console.error("Failed to generate documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (items.length === 0) {
      return (
        <div className='flex-1 flex items-center justify-center text-gray-500'>
          No documents available for this template.
        </div>
      );
    }
    return <Carousel items={items} />;
  };

  const renderTable = () => {
    if (!msDocument || msDocument.length === 0) {
      return (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Variable Name
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddRow}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} className="mr-2" /> Add
              </button>
              <div className="flex items-center">
                <span className="px-4 py-2 border-b-2 border-indigo-600 font-semibold text-indigo-600">
                  Document 1
                </span>
              </div>
              <Maximize2 className="text-gray-500 cursor-pointer" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
            {(highlightsArray || []).map((highlight, index) => (
              <React.Fragment key={index}>
                <div className="p-3 border rounded-md bg-gray-50 text-gray-800 flex items-center">
                  {highlight.label}
                </div>
                <div>
                  <input
                    type="text"
                    value={highlight.text || ""}
                    onChange={(e) =>
                      handleInputChange(e.target.value, 0, index)
                    }
                    onBlur={() => handleBlur(0, index)}
                    className="w-full p-3 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }
  
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Variable Name</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddRow}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus size={18} className="mr-2" /> Add
            </button>
            <div className="flex items-center">
              <span className="px-4 py-2 border-b-2 border-indigo-600 font-semibold text-indigo-600">
                {tableData[0]?.fileName || "Document 1"}
              </span>
            </div>
            <Maximize2
              className="text-gray-500 cursor-pointer"
              onClick={() => handleViewDocument(tableData[0])}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
          {tableData[0]?.highlights.map((highlight, index) => {
            // If highlight has a nested highlights array, render those
            if (Array.isArray(highlight.highlights) && highlight.highlights.length > 0) {
              return highlight.highlights.map((nested, nidx) => (
                <React.Fragment key={`${index}-${nidx}`}>
                  {nested.labels && nested.labels.length > 0
                    ? nested.labels.map((lbl, lidx) => (
                        <div key={lidx} className="flex items-center mb-2">
                          <div className="w-1/3 p-3 border rounded-md bg-gray-50 text-gray-800">
                            {lbl.label}
                          </div>
                          <input
                            type="text"
                            value={lbl.value || ""}
                            onChange={e => {
                              // Update the value in the nested label
                              const updatedTableData = [...tableData];
                              updatedTableData[0].highlights[index].highlights[nidx].labels[lidx].value = e.target.value;
                              setTableData(updatedTableData);
                            }}
                            className="w-2/3 p-3 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none ml-2"
                          />
                        </div>
                      ))
                    : <div className="text-gray-500">No labels</div>}
                </React.Fragment>
              ));
            }
            // Otherwise, render as before (flat highlight)
            return (
              <div key={index} className="flex items-center mb-2">
                <div className="w-1/3 p-3 border rounded-md bg-gray-50 text-gray-800">
                  {highlight.label}
                </div>
                <input
                  type="text"
                  value={highlight.text || ""}
                  onChange={e => handleInputChange(e.target.value, 0, index)}
                  onBlur={() => handleBlur(0, index)}
                  className="w-2/3 p-3 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none ml-2"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleHighlightUpdate = async (highlightId, updatedData) => {
    await updateHighlight(highlightId, updatedData);
    // Re-fetch template and document data to update the UI
    fetchData();
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      <div className='flex-1 flex flex-col p-6 overflow-y-auto'>
        <table className="w-full">
          <thead>
            <tr>
              <th>Variable Name</th>
              {(Array.isArray(msDocument) ? msDocument : []).map((doc, colIdx) => (
                <th key={doc.id || colIdx}>{doc.fileName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(highlightsArray || (Array.isArray(msDocument) && msDocument[0]?.highlights) || []).map((variable, rowIdx) => (
              <tr key={variable.id || rowIdx}>
                <td>{variable.label}</td>
                {(Array.isArray(msDocument) ? msDocument : []).map((doc, colIdx) => (
                  <td key={doc.id || colIdx}>
                    <input
                      type="text"
                      value={doc.highlights[rowIdx]?.text || ""}
                      onChange={e => handleInputChange(e.target.value, colIdx, rowIdx)}
                      className="w-full p-2 border rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-80 p-4'>
        <Instructions
          handleExportAll={handleExportAll}
          viewAllDocument={viewAllDocument}
          displayListofDocuments={displayListofDocuments}
        />
      </div>

      {isModalOpen && (
        <DocumentHighlightsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          highlight={highlight}
          currentDoc={currentDoc}
          onSave={saveTableOrImage}
        />
      )}
    </div>
  );
};

export default HighlightTable;
