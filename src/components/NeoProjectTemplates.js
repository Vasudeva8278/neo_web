import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdKeyboardArrowDown,
  MdArrowDropDown
} from "react-icons/md";
import { RiMenuFill, RiLayout4Line } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import {
  FaUpload,
  FaFileAlt,
  FaRegFolderOpen,
  FaDownload,
  FaTrash,
  FaMagic
} from "react-icons/fa";
import { GoHome } from "react-icons/go";
import CanvasThumbnails from "./CanvasThumbnails";
import TemplateCards from "./Template/TemplateCards";
import SearchHeader from "./SearchHeader";
import NeoModal from "./NeoModal";
import ViewTemplatesHighlights from "./Template/ViewTemplatesHighlights";

import { getTemplatesByProjectId, deleteTemplate } from "../services/templateApi";
import {
  getHomePageDocuments,
  deleteDocument,
  downloadDocument
} from "../services/documentApi";

const NeoProjectTemplates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);

  const projectData = location.state?.data;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [docTemplates, setDocTemplates] = useState([]);

  const fetchTemplates = useCallback(async () => {
    if (!projectData?._id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getTemplatesByProjectId(projectData._id);
      setDocuments(response);
    } catch (err) {
      console.error("Failed to fetch templates", err);
      if (err.message === "Network Error") {
        setError("Backend server is not running. Please start the server at http://localhost:7000");
      } else {
        setError(err.message || "Failed to fetch templates for this project");
      }
    } finally {
      setLoading(false);
    }
  }, [projectData]);

  const fetchDocuments = useCallback(async () => {
    if (!projectData?._id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getHomePageDocuments(projectData._id);
      setDocTemplates(data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      if (err.message === "Network Error") {
        setError("Backend server is not running. Please start the server at http://localhost:7000");
      } else {
        setError(err.message || "Failed to fetch documents");
      }
    } finally {
      setLoading(false);
    }
  }, [projectData]);

  useEffect(() => {
    if (projectData && projectData._id) {
      fetchTemplates();
      fetchDocuments();
    }
  }, [projectData, fetchTemplates, fetchDocuments]);

  useEffect(() => {
    if (documents && documents.length > 0) {
      const sorted = [...documents].sort((a, b) => {
        if (!a.updatedTime) return 1;
        if (!b.updatedTime) return -1;
        return new Date(b.updatedTime) - new Date(a.updatedTime);
      });
      setRecentDocuments(sorted);
    }
  }, [documents]);

  const handleDeleteTemplate = async (docId) => {
    try {
      const response = await deleteTemplate(projectData._id, docId);
      if (response.status === 204) {
        fetchTemplates();
        alert("Document deleted successfully");
      } else {
        throw new Error("Failed to delete document.");
      }
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const handleGenerateDocs = () => {
    navigate(`/viewAllHighlights`, {
      state: { project: projectData }
    });
  };

  const handleDeleteDocument = async (doc_id) => {
    try {
      await deleteDocument(projectData._id, doc_id);
      fetchTemplates();
      fetchDocuments();
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const handleDocumentDownload = async (docObj) => {
    try {
      const { _id, fileName } = docObj;
      const response = await downloadDocument(_id, fileName);
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName.trim()}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading document:", err);
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        <div className="flex text-gray-400 text-xs p-3">
          {projectData.projectName}
        </div>

        <div className="m-2">
          <SearchHeader projectId={projectData._id} hasProject={true} />
        </div>

        <div className="flex flex-col p-4 space-y-8">
          <div className="w-full max-w-5xl">
            <button
              className="mb-4 bg-white text-green-600 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-100 flex items-center"
              onClick={handleGenerateDocs}
              disabled={documents?.length === 0}
            >
              <FaMagic className="mr-2" /> Generate Client Documents
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-left">
              Saved Templates for {projectData.projectName}
            </h2>

            <div className="flex justify-center">
              {loading && <div>Loading...</div>}
              {error && <div className="text-red-500">{error}</div>}
              {!loading && !error && documents?.length === 0 && (
                <div></div>
              )}
              {!loading && !error && (
                <TemplateCards
                  documents={documents}
                  handleDeleteTemplate={handleDeleteTemplate}
                  projectId={projectData._id}
                />
              )}
            </div>
          </div>

          <div className="w-full max-w-5xl">
            <h2 className="text-2xl font-semibold mb-4 text-left">
              Documents with Template Names
            </h2>
            <div className="flex justify-center space-x-4">
              {loading && <div>Loading...</div>}
              {error && <div className="text-red-500">{error}</div>}
              {!loading && !error && docTemplates?.length === 0 && (
                <div>No documents found for this project.</div>
              )}
              {!loading && !error && docTemplates?.length > 0 && (
                <TemplateCards
                  documents={docTemplates}
                  projectId={projectData._id}
                  template={true}
                  handleDeleteTemplate={handleDeleteDocument}
                  handleDownload={handleDocumentDownload}
                  className="border p-4 rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeoProjectTemplates;
