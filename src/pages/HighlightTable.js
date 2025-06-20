import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Instructions from "../components/Instructions";
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
import TooltipIcon from "../components/TooltipIcon";
import FileCarousel from "../components/FileCarousel";
import Carousel from "../components/FileCarousel";

const HighlightTable = ({ highlightsArray, templateId, filename }) => {
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
  const projectId = queryParams.get("projectId");

  console.log(templateId, filename);
  const fetchData = async () => {
    try {
      const response = await getDocumentsListByTemplateId(projectId, templateId);
      setTemplateName(response?.templateName || "Template");
      const data = response?.documents || [];
      setMsDocument(data);
      console.log(data);

      const items =
        data.length > 0
          ? data.map((item) => ({
              id: item._id,
              image: item?.thumbnail, // Assuming `thumbnail` exists in each item
              title: item.fileName,
              description: (item.highlights || []) // Guard against undefined highlights
                .filter((highlight) => highlight.type === "text")
                .map((highlight) => highlight.text)
                .join(" "),
            }))
          : [];

      setItems(items);
      setTableData(
        data.length > 0
          ? data
          : (highlightsArray || []).map((highlight) => ({ // Guard against undefined prop
              ...highlight,
              id: uuidv4(),
              templateId,
            }))
      );
    } catch (error) {
      console.error("Failed to fetch and process highlight table data:", error);
      // Optionally, set an error state here to inform the user.
    }
  };

  useEffect(() => {
    console.log(templateId);
    fetchData();
  }, [highlightsArray, templateId]);

  const viewAllDocument = (docId) => {
    navigate(`/docviewall/${templateId}?projectId=${projectId}`);
  };
  const handleInputChange = (value, rowIndex, cellIndex) => {
    const updatedTableData = [...tableData];
    try {
      updatedTableData[rowIndex].highlights[cellIndex].text = value;
    } catch (err) {
      updatedTableData[rowIndex].fileName = value;
    }
    setTableData(updatedTableData);
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
    const doc_id = doc.id ? doc.id : doc._id;
    console.log("viewing document", doc_id);
    navigate(`/docview/${doc_id}`);
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

  const handleAddRow = async () => {
    if (tableData[0].highlights) {
      const newCells = {
        id: uuidv4(),
        templateId,
        fileName: "DocName" + tableData.length,
        highlights: tableData[0].highlights.map((cell) => ({
          id: cell.id,
          label: cell.label,
          text: cell.text,
          type: cell.type,
        })),
      };
      const response = await addNewDocument(newCells);
      const { id } = response;
      newCells.id = id;
      setTableData([...tableData, newCells]);
    }
  };
  const handleExportAll = async (event) => {
    event.preventDefault();
    const documentIds = (msDocument || []).map((doc) => doc._id);
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

  const renderHeader = () => (
    <div className='flex items-center justify-between p-4 bg-white border-b border-gray-200'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => navigate(-1)}
          className='p-2 rounded-md hover:bg-gray-100'
        >
          <ArrowLeft className='w-5 h-5 text-gray-600' />
        </button>
        <h1 className='text-xl font-semibold text-gray-800'>
          {templateName}
        </h1>
      </div>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-4 py-2 w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50'>
          <Eye className='w-5 h-5' />
          Preview
        </button>
        <button
          onClick={handleExportAll}
          className='px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700'
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
        <button className='p-2 rounded-full hover:bg-gray-100'>
          <HelpCircle className='w-6 h-6 text-gray-500' />
        </button>
      </div>
    </div>
  );

  const renderTable = () => {
    if (tableData.length === 0) {
      return (
        <div className='text-center p-8 text-gray-500'>
          No documents found for this template.
        </div>
      );
    }

    const firstDocument = tableData[0];

    // Add a robust guard to ensure the document and its highlights exist
    if (!firstDocument || !Array.isArray(firstDocument.highlights)) {
      return (
        <div className='text-center p-8 text-gray-500'>
          Document is missing highlight data.
        </div>
      );
    }

    const variableNames = firstDocument.highlights.map((h) => h.label);

    return (
      <div className='flex-1 p-4 overflow-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Column 1: Variable Names */}
          <div className='bg-white p-4 rounded-lg border'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-semibold text-gray-700'>Variable Name</h2>
              <button className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'>
                <Plus className='w-4 h-4' />
                Add
              </button>
            </div>
            <div className='space-y-2'>
              {variableNames.map((name, index) => (
                <div
                  key={index}
                  className='px-4 py-3 bg-gray-50 border rounded-md text-gray-800'
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Document 1 */}
          <div className='bg-white p-4 rounded-lg border'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-semibold text-gray-700'>
                {firstDocument.fileName}
              </h2>
              <button className='p-2 rounded-md hover:bg-gray-100'>
                <Maximize2 className='w-5 h-5 text-gray-500' />
              </button>
            </div>
            <div className='space-y-2'>
              {firstDocument.highlights.map((highlight, index) => (
                <input
                  key={highlight._id}
                  type='text'
                  value={highlight.text}
                  onChange={(e) => handleInputChange(e.target.value, 0, index)}
                  className='w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {renderHeader()}
      {renderTable()}
    </div>
  );
};

export default HighlightTable;
