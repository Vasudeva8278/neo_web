import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown, MdArrowDropDown } from "react-icons/md";
import { RiMenuFill, RiLayout4Line } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import {
  FaUpload,
  FaFileAlt,
  FaRegFolderOpen,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import CanvasThumbnails from "./CanvasThumbnails";
import photo from "../Assets/photo.png";
import * as docx from "docx-preview";
import TemplateCards from "./Template/TemplateCards";
import axios from "axios";
import {
  createNeoTemplate,
  deleteTemplateById,
  getAllTemplates,
} from "../services/templateApi";
import {
  deleteDocument,
  downloadDocument1,
  getDocumentsWithTemplateNames,
} from "../services/documentApi";
import SearchHeader from "./SearchHeader";
import { useSelector, useDispatch } from 'react-redux';
import { fetchDocumentsWithTemplateNames } from '../redux/slice/documentSlice';

const Neo = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [docTemplates, setDocTemplates] = useState([]);
  const contentRef = useRef(null);
  const [conversionStatus, setConversionStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { documents: reduxDocuments, status: reduxStatus, error: reduxError } = useSelector(state => state.documents);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(null);

  const handleSelectDocument = (docId) => {
    navigate(`/document/${docId}`);
  };

  const handleExport = (docId) => {
    navigate(`/export/${docId}`);
  };

  const handleProjects = () => {
    navigate(`/projects`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
  };

  const handleFileChange = (e) => {
    
  };

  const onGetFile = async (file) => {
    setFile(file);
    setUploading(true);

    const container = document.getElementById("container");
    container.innerHTML = ""; // Clear previous content

    const options = {
      // className: "docx", //class name/prefix for default and document style classes
      inWrapper: true, //enables rendering of wrapper around document content
      ignoreWidth: false, //disables rendering width of page
      ignoreHeight: false, //disables rendering height of page
      ignoreFonts: false, //disables fonts rendering
      breakPages: true, //enables page breaking on page breaks
      ignoreLastRenderedPageBreak: true, //disables page breaking on lastRenderedPageBreak elements
      // experimental:  false, //enables experimental features (tab stops calculation)
      //trimXmlDeclaration:  true, //if true, xml declaration will be removed from xml documents before parsing
      // useBase64URL: true, //if true, images, fonts, etc. will be converted to base 64 URL, otherwise URL.createObjectURL is used
      // renderChanges: false, //enables experimental rendering of document changes (inserions/deletions)
      renderHeaders: true, //enables headers rendering
      renderFooters: true, //enables footers rendering
      renderFootnotes: true, //enables footnotes rendering
      renderEndnotes: true, //enables endnotes rendering
      // renderComments: true, //enables experimental comments rendering
      // debug: false, //enables additional logging
    };

    try {
      await docx.renderAsync(file, container, null, options);
      console.log("docx: finished");
      console.log(container.innerHTML);

      // Convert all image elements to Base64
      const images = container.querySelectorAll("img");
      if (images.length > 0) {
        for (let img of images) {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            // Convert the image to a JPEG data URL
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const image = new Image();

            image.onload = () => {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
              img.src = canvas.toDataURL("image/png");

              // Call convertFiled after all images are converted
              if (
                [...images].every((image) =>
                  image.src.startsWith("data:image/png")
                )
              ) {
                convertFiled(container.innerHTML, file);
              }
            };

            image.src = reader.result;
          };

          reader.readAsDataURL(blob);
        }
      } else {
        convertFiled(container.innerHTML, file);
      }

      // Ensure the container height matches the document height for pagination
      const pages = container.querySelectorAll(".docx-page");
      if (pages.length > 0) {
        const totalHeight = Array.from(pages).reduce(
          (height, page) => height + page.scrollHeight
        );
        container.style.height = `${totalHeight}px`;
      }
    } catch (error) {
      console.error("docx rendering error:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
    dispatch(fetchDocumentsWithTemplateNames());
  }, [dispatch]);

  const fetchDocuments = async () => {
    try {
      const response = await getDocumentsWithTemplateNames();
      setDocTemplates(response.data);
    } catch (error) {
      setError("Failed to fetch documents");
      console.error("Failed to fetch documents", error.response || error.message || error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTemplates = async () => {
    try {
      const response = await getAllTemplates();
      const data = response;
      setDocuments(data);
      const sortedData = data.sort((a, b) => {
        if (!a.updatedTime) return 1;
        if (!b.updatedTime) return -1;
        return new Date(b.updatedTime) - new Date(a.updatedTime);
      });
      setRecentDocuments(sortedData);
    } catch (error) {
      setError("Failed to fetch documents");
      console.error("Failed to fetch documents", error.response || error.message || error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteTemplate = async (docId) => {
    console.log(`Deleting `, docId);
    try {
      const response = await deleteTemplateById(docId);
      if (response) {
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc._id !== docId)
        );
        alert("Document deleted successfully");
      } else {
        throw new Error(`Failed to delete document.`);
      }
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };
  const handleDeleteDocument = async (doc_id) => {
    console.log("deleting document", doc_id);
    const response = await deleteDocument(doc_id);
    if (response) {
      fetchTemplates();
      fetchDocuments();
    }
  };
  const convertFiled = async (content, file) => {
    setConversionStatus("Converting...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", content);

    try {
      const response = await createNeoTemplate(formData);
      if (response && response.success) {
        setUploading(false);
        const result = response.data;
        handleSelectDocument(result._id);
        setConversionStatus(`Conversion successful!`);
        fetchTemplates(); // Refresh templates list
      } else {
        throw new Error(response?.message || "Conversion failed");
      }
    } catch (error) {
      console.error("Template creation error:", error);
      setConversionStatus("Failed to create template. Please try again.");
      setTimeout(() => {
        setConversionStatus("");
      }, 3000);
    }
  };

  const handleDocumentDownload = async (docObj) => {
    try {
      const id = docObj._id;
      const fileName = docObj.fileName;
      const response = await downloadDocument1(id);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName.trim() + ".docx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  return (
    <div className='flex ml-12'>


      
      <div className='flex flex-col w-full m-2'>
        <div className='flex text-gray-400 text-xs p-3'>All Templates </div>
        <SearchHeader />
        <div
          className='bg-gradient-to-r from-purple-500 to-blue-500 h-52 rounded-lg mt-4 ml-4 p-10 hidden'
          style={{ height: "220px" }}
        >
          <div
            className='relative w-[500px] mx-auto '
            style={{ width: "500px" }}
          >
            <BsSearch className='absolute h-max top-1/2 left-5 transform -translate-y-1/2 pointer-events-none' />
            <input
              className='w-full pl-10 py-2 border border-gray-300 rounded-full text-sm outline-none'
              placeholder='Search'
            />
          </div>

          <div className='flex mt-4 '>
            <div className='flex flex-col items-center mb-4 w-full '>
              <div
                className={`flex flex-col items-center justify-center w-52 h-24 border-gray-500     shadow-lg rounded-lg text-white mx-4 ${
                  isDragging ? "border-green-500 bg-blue-100" : "border-white"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className='text-center py-10 relative w-full mb-10'>
                  <input
                    type='file'
                    name='docxFile'
                    accept='.docx, .pdf'
                    onChange={handleFileChange}
                    className='opacity-0 absolute inset-0 cursor-pointer border border-gray-300 shadow-lg shadow-white'
                  />
                  <button className='mt-2 px-4 py-2 text-white rounded hover:bg-blue-700 justify-between'>
                    <FaUpload className='m-6 mb-1 text-white' />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
              {uploading && (
                <div className='fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50'>
                  <div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32'></div>
                </div>
              )}
              <div
                id='container'
                style={{
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  marginTop: "20px",
                  padding: "30px",
                  position: "relative",
                  display: "none",
                }}
                ref={contentRef}
              ></div>
            </div>
          </div>
        </div>
        <div className='flex flex-col p-2 sm:p-4 space-y-4 sm:space-y-8 w-full'
        >
          <div className='w-full max-w-7xl'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4 text-left w-full border-b-2 border-black'>
              Saved Templates
            </h2>
            <div className='flex justify-center w-full'>
              {loading && <div>Loading...</div>}
              <TemplateCards
                documents={documents}
                handleDeleteTemplate={handleDeleteTemplate}
              />
            </div>
          </div>
          {/* 
  <div className="w-full max-w-4xl">
    <h2 className="text-2xl font-semibold mb-4 text-left">Recent Docs</h2>
    <div className="flex justify-center space-x-6">
    {loading && <div>Loading...</div>}
      <TemplateCards documents={recentDocuments} handleDeleteTemplate={handleDeleteTemplate} />
    </div>
  </div> */}

          <div className='w-full max-w-4xl'>
            <h2 className='text-2xl font-semibold mb-4 text-left'>
              Documents with Template Names
            </h2>
            <div className='flex flex-wrap gap-6 justify-start'>
              {reduxStatus === 'loading' && <div>Loading...</div>}
              {reduxError && <div className="text-red-500">{reduxError}</div>}
              {reduxStatus === 'succeeded' && reduxDocuments && reduxDocuments.length > 0 && (
                reduxDocuments.map((doc) => {
                  console.log(doc);
                  return (
                    <div key={doc._id} className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center relative border border-gray-200 group">
                      {/* File Icon with Preview Symbol */}
                      <div className="relative mb-4">
                        <FaFileAlt className="text-blue-500 text-6xl" />
                      </div>
                      {/* File Name */}
                      <div className="font-semibold text-lg text-center truncate w-full" title={doc.fileName}>{doc.fileName}</div>
                      {/* Template Name */}

                      {/* Options menu */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="relative">
                          <button
                            className="p-1.5 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-all duration-200"
                            onClick={e => {
                              e.stopPropagation();
                              setOptionsMenuOpen(doc._id);
                            }}
                          >
                            <RiMenuFill />
                          </button>
                          {optionsMenuOpen === doc._id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1 text-sm">
                              <button
                                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                onClick={e => {
                                  e.stopPropagation();
                                  navigate(`/docview/${doc._id}?templateId=${doc.templateId}`);
                                  setOptionsMenuOpen(null);
                                }}
                              >
                                <FaFileAlt className="mr-2" /> View
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDocumentDownload(doc);
                                  setOptionsMenuOpen(null);
                                }}
                              >
                                <FaDownload className="mr-2" /> Download
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteDocument(doc._id);
                                  setOptionsMenuOpen(null);
                                }}
                              >
                                <FaTrash className="mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Neo;
