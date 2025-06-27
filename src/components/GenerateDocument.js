import React, { useState, useContext, useEffect } from "react";
import { GoProjectTemplate } from "react-icons/go";
import { getHighlightsByTemplateId } from "../services/highlightsApi";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemplatesByProjectId } from '../redux/slice/templateSlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";
import { fetchDocumentsWithTemplateNames } from '../redux/slice/documentSlice';
import { getDocumentsWithTemplateNames } from '../services/documentApi';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchProjectTemplateDocument = async (projectId, templateId) => {
  try {
    const response = await fetch(
      `http://localhost:7000/api/project/${projectId}/templates/${templateId}`
    );
    if (!response.ok) throw new Error("Failed to fetch document vasudev");
    return await response.json();
  } catch (error) {
    console.error("Error fetching project template document:", error);
    return null;
  }
};

const GenerateDocument = ({ onClose, value, hasProject }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState(value || "");
  const [templateId, setTemplateId] = useState("");
  const [highlights, setHighlights] = useState([]);
  const { projects } = useContext(ProjectContext);
  const { templates, status, error } = useSelector((state) => state.templates);
  const { documents, status: documentStatus, error: documentError } = useSelector(state => state.documents);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [projectTemplateDoc, setProjectTemplateDoc] = useState(null);

  console.log('projectId:', projectId, 'value:', value);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTemplatesByProjectId(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' || status === 'failed') {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (templateId) {
      getHighlightsByTemplateId(templateId)
        .then(setHighlights)
        .catch((err) => {
          console.error("Failed to fetch highlights:", err);
          toast.error("Failed to load highlights for the selected template.");
        });
    } else {
      setHighlights([]);
    }
  }, [templateId]);

  useEffect(() => {
    dispatch(fetchDocumentsWithTemplateNames());
  }, [dispatch]);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (projectId && templateId) {
      fetchProjectTemplateDocument(projectId, templateId).then((data) => {
        setProjectTemplateDoc(data);
      });
    } else {
      setProjectTemplateDoc(null);
    }
  }, [projectId, templateId]);

  const handleTemplateChange = (e) => {
    setTemplateId(e.target.value);
  };

  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    setProjectId(selectedProjectId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }
    if (!templateId) {
      toast.error("Please select a template");
      return;
    }
    navigate(`/export/${templateId}?projectId=${projectId}`);
  };

  const handlePreview = () => {
    if (!templateId) {
      toast.error("Please select a template to preview");
      return;
    }
    navigate(`/highlight/${templateId}`);
  };

  console.log("All templates:", templates);
  console.log("Current projectId:", projectId);

  const filteredTemplates = templates;

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex h-screen">
        <div className="relative border-r border-gray-300 flex flex-col w-64 bg-gray-100 h-full overflow-y-auto">
          {/* ...sidebar code... */}
        </div>
        <div className="flex-1 h-full overflow-y-auto">
          <div
            className="flex flex-col w-full h-full overflow-y-auto"
            style={{ maxHeight: "100vh" }}
          >
            <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <ToastContainer />
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-normal">Generate Documents</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={onClose}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="projectName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Project Name*
                    </label>
                    <select
                      className={`mt-1 block w-full py-2 px-3 border rounded-md shadow-sm sm:text-sm ${
                        hasProject
                          ? "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-500"
                          : "bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                      value={projectId}
                      onChange={handleProjectChange}
                      disabled={hasProject}
                    >
                      <option value="">Select project</option>
                      {(projects || []).map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="templateName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Templates
                    </label>
                    <select
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={templateId}
                      onChange={handleTemplateChange}
                    >
                      <option value="">Select Template</option>
                      {(filteredTemplates || []).map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.fileName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {highlights && highlights.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Editable Fields
                      </label>
                      <div className="p-2 border rounded-md bg-gray-50">
                        {highlights.map((highlight, index) => (
                          <div key={index}>
                            {Array.isArray(highlight.highlights) && highlight.highlights.length > 0 ? (
                              highlight.highlights.map((h, idx) => (
                                <div key={idx}>
                                  {Array.isArray(h.labels) && h.labels.length > 0 ? (
                                    h.labels.map((lbl, lidx) => (
                                      <span
                                        key={lidx}
                                        className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                                      >
                                        {lbl.label}: {lbl.value}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-gray-500">No labels</span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {highlight.label ? `${highlight.label}: ${highlight.text}` : 'No labels'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded mr-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="bg-green-500 hover:bg-green-700 text-white font-normal py-2 px-4 rounded mr-2"
                    >
                      Preview
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded"
                    >
                      Proceed
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;