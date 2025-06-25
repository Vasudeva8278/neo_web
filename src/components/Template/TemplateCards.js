import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateContext } from '../../context/TemplateContext';
import { SlOptionsVertical } from "react-icons/sl";
import { deleteTemplate } from '../../services/templateApi';
import { toast } from 'react-toastify';
import { deleteHighlightsByTemplateId } from '../../services/highlightsApi';

const Card = ({ docObj, documentId, name, thumbnail, content, handleDelete, handleDownload, template, projectId }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [deleteTemplateModal, setDeleteTemplateModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleView = (docId) => {
    if (template) {
      navigate(`/docview/${docId}`);
    } else {
      navigate(`/document/${docId}`);
    }
  };

  const handleEdit = (docId) => {
    let goTo;
    if (projectId) {
      goTo = `/document/${docId}?projectId=${projectId}`
    } else {
      goTo = `/document/${docId}`
    }
    navigate(goTo);
  };

  const promptForDeletion = (documentId) => {
    setDeleteTemplateModal(true);
  }

  const handleCreateDocuments = (docId) => {
    navigate(`/export/${projectId}/${docId}`);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const handleDownloadDocument = (docObj) => {
    setMenuOpen(false);
    handleDownload(docObj);
  }

  const confirmDelete = async () => {
    setDeleteTemplateModal(false);
    await handleDelete(documentId);

  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Inline SVG for EllipsisV icon
  const EllipsisVIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" fill="currentColor" className="w-5 h-5">
      <path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM0 128c0 53 43 96 96 96s96-43 96-96S149 32 96 32 0 75 0 128zm0 256c0 53 43 96 96 96s96-43 96-96S149 320 96 320 0 363 0 416z"/>
    </svg>
  );

  // Inline SVG for FileAlt icon
  const FileAltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4 mr-2">
      <path d="M369.9 97.9L286 14.1C277.9 5.7 266.4 0 254.6 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V154.6c0-11.8-4.7-23.3-12.1-31.7zM320 464H64V48h160v104c0 13.3 10.7 24 24 24h104v288z"/>
    </svg>
  );

  // Inline SVG for Edit icon
  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-4 h-4 mr-2">
      <path d="M402.6 83.2l90.2 90.2c12.5 12.5 12.5 32.8 0 45.3l-246.3 246.3c-12.5 12.5-32.8 12.5-45.3 0L32.8 325.2c-12.5-12.5-12.5-32.8 0-45.3l246.3-246.3c12.5-12.5 32.8-12.5 45.3 0l90.2 90.2zm20.4-20.4L330.4 0H512c35.3 0 64 28.7 64 64V240.4L423 42.6zM0 432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V384H0v48z"/>
    </svg>
  );

  // Inline SVG for Download icon
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 mr-2">
      <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256H136c-22.1 0-41 12.7-50.5 32.5s-2.3 43.1 12.7 58.1L236.4 445.6c12.5 12.5 32.8 12.5 45.3 0l152-152c15-15 17.7-37.5 12.7-58.1s-28.4-32.5-50.5-32.5H288V32z"/>
    </svg>
  );

  // Inline SVG for Trash icon
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 mr-2">
      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.4C301.1 6.8 291.5 0 281.3 0H166.7c-10.2 0-19.8 6.8-23.5 17.7zM400 128H48L70.4 472c1.1 18.1 16.5 32 34.6 32H343c18.1 0 33.5-13.9 34.6-32L400 128z"/>
    </svg>
  );

  return (
    <div 
      className="relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer "
      style={{ width: '100%', minHeight: '200px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleView(documentId)}
    >
      {/* Top right menu button */}
      <div className="absolute top-3 right-3 z-10 w-full" ref={menuRef}>
        <button
          className="p-1.5 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-all duration-200 ml-4"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
        >
          <SlOptionsVertical />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1 text-sm">
            {!template && (
              <button
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateDocuments(documentId);
                }}
              >
                <FileAltIcon /> Create Document
              </button>
            )}
            {template && (
              <button
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(documentId);
                }}
              >
                <FileAltIcon /> View
              </button>
            )}
            {!template && (
              <button
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(documentId);
                }}
              >
                <EditIcon /> Edit
              </button>
            )}
            {template && (
              <button
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadDocument(docObj);
                }}
              >
                <DownloadIcon /> Download
              </button>
            )}
            <button
              className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                promptForDeletion(documentId);
              }}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        )}
      </div>

      {/* File Icon Section */}
       <div className="flex items-center justify-center pt-8 pb-4">
         <div className="relative">
           {/* File Icon */}
           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-blue-500">
             <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="currentColor"/>
             <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
           {/* Document Count Badge */}
           <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
             {docObj?.documentCount || '0'}
           </div>
         </div>
       </div>

      {/* Content section */}
      <div className="flex-1 px-4 pb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-500">
          {docObj?.documentCount || '0'} Documents
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Last updated: {docObj?.lastUpdated || '6/15/2025'}
        </p>
      </div>

      {/* Delete Confirmation Modal (inlined) */}
      {deleteTemplateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
            <h5 className="text-xl font-bold text-center mb-4 text-gray-800">Are you sure?</h5>
            <p className="text-center mb-6 text-gray-600">You want to delete the {template ? 'document' : 'template'}?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
                onClick={() => setDeleteTemplateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200"
                onClick={() => confirmDelete()}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TemplateCards = ({ template, projectId }) => {
  const { templates, setTemplates } = useContext(TemplateContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteTemplate = async (templateId) => {
    try {
      // You may need projectId for the API call
      await deleteTemplate(projectId, templateId);
      toast.success('Template deleted successfully!');
      // Option 1: Remove from UI
      setTemplates(prev => prev.filter(t => t._id !== templateId));
      // Option 2: Reload page or refetch templates (if using context, trigger context update)
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete template.');
      console.error('Deleting template failed:', error);
    }
  };

  const handleDownload = (template) => {
    // Add download logic here
    console.log('Downloading template:', template);
  };

  if (!templates) {
    return <div>Loading templates...</div>;
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4 sm:p-6 bg-gray-50 h-full overflow-y-auto w-full"
      style={{ gap: '16px' }}
    >
      {templates
        .filter((doc, index, self) => 
          // Remove duplicates based on document ID
          index === self.findIndex(item => item._id === doc._id)
        )
        .map((doc) => (
          <Card
            key={doc._id}
            docObj={doc}
            documentId={doc._id}
            name={doc.fileName}
            thumbnail={doc.thumbnail}
            content={doc.content}
            handleDelete={handleDeleteTemplate}
            handleDownload={handleDownload}
            template={template}
            projectId={projectId}
          />
        ))
      }
    </div>
  );
};

export default TemplateCards;
