import React, { useEffect, useState } from 'react';
import DesignTemplate from './DesignTemplate';
import NeoModal from './NeoModal';
import GenerateDocument from './GenerateDocument';
import { FaMagic, FaSearch, FaPenNib } from "react-icons/fa";
import bannerImage from "../Assets/banner2.png";

const MOBILE_MAX_WIDTH = 425;

const SearchHeader = ({ projectId, hasProject = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayPage, setDisplayPage] = useState("");
  const [selectedProject, setSelectedProject] = useState(projectId || '');

  useEffect(() => {
    if (projectId) setSelectedProject(projectId);
  }, [projectId]);

  const openModal = (page) => {
    setDisplayPage(page);
    setIsModalOpen(true);
  };

  return (
    <>
    <div className="flex flex-col items-center w-full" style={{ minWidth: MOBILE_MAX_WIDTH }}>
      <div className="w-full shadow-md">
        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates or documents"
              className="w-full p-3 pl-12 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              aria-label="Search templates or documents"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="relative mb-3 px-4">
          <div
            className="h-28 rounded-lg overflow-hidden shadow-md border-4"
            style={{
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="h-full flex flex-col justify-center px-4 bg-black bg-opacity-50">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">
                Revolutionize Document Management<br />
                <span className="text-teal-300">with Automation</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
       

        {/* Modal */}


        <NeoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <React.Suspense fallback={<div className="p-4">Loading...</div>}>
            {(() => {
              try {
                if (displayPage === 'designTemplates') {
                  return (
                    <DesignTemplate
                      onClose={() => setIsModalOpen(false)}
                      value={selectedProject}
                      hasProject={hasProject}
                    />
                  );
                }
                if (displayPage === 'generateDocs') {
                  return (
                    <GenerateDocument
                      onClose={() => setIsModalOpen(false)}
                      value={selectedProject}
                      hasProject={hasProject}
                    />
                  );
                }
                return <div className="p-4 text-gray-500">No content selected.</div>;
              } catch (err) {
                console.error('Error rendering modal content:', err);
                return <div className="p-4 text-red-500">An error occurred while loading the modal content.</div>;
              }
            })()}
          </React.Suspense>
        </NeoModal>
      </div>
      
    </div>
    <div className="flex flex-row sm:flex-row justify-end gap-3 px-4 pb-4 mt-4">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200 font-semibold w-full sm:w-60 cursor-pointer"
            onClick={() => openModal('designTemplates')}
          >
            <FaPenNib className="w-5 h-5" />
            <span>Design Template</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-200 font-semibold w-full sm:w-60 cursor-pointer"
            onClick={() => openModal('generateDocs')}
          >
            <FaMagic className="w-5 h-5" />
            <span>Generate Documents</span>
          </button>
        </div>
    </>
  );
};

export default SearchHeader;
