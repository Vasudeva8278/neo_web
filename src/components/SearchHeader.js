import React, { useEffect, useState } from 'react';
import DesignTemplate from './DesignTemplate';
import NeoModal from './NeoModal';
import GenerateDocument from './GenerateDocument';
import { Search, FileText, Sparkles, ChevronRight, User } from 'lucide-react';
import bannerImage from "../Assets/Banner.jpg";

const SearchHeader = ({ projectId, hasProject = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayPage, setDisplayPage] = useState("");
  const [selectedProject, setSelectedProject] = useState(projectId || '');

  const openModal = (page) => {
    setDisplayPage(page);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for template/documents"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
          />
        </div>
        
        <div className="flex items-center gap-2 rounded-full px-3 py-2 cursor-pointer border border-gray-200 hover:border-gray-300 transition">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-800">Personal</div>
            <div className="text-gray-500 text-xs">UX codefacts</div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
     
      {/* Promotional Banner */}
      <div className="mb-6 relative">
        <div 
          className="bg-cover bg-center rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url(${bannerImage})`, height: '250px' }}
        >
          <div className="flex items-center justify-between p-8 relative h-full bg-opacity-30">
            {/* Arrows for banner */}
          </div>
        </div>
      </div>

      {/* Recent Files Section */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => openModal('designTemplates')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-md"
        >
          <FileText className="w-5 h-5" />
          Design Template
        </button>
        <button
          onClick={() => openModal('generateDocs')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md"
        >
          <Sparkles className="w-5 h-5" />
          Generate Documents
        </button>
      </div>
    
      {/* Modal using the existing NeoModal for consistency */}
      <NeoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <React.Suspense fallback={<div className="p-4">Loading...</div>}>
          {(() => {
            try {
              if (displayPage === 'designTemplates') {
                return <DesignTemplate onClose={() => setIsModalOpen(false)} value={selectedProject} hasProject={hasProject} />;
              }
              if (displayPage === 'generateDocs') {
                return <GenerateDocument onClose={() => setIsModalOpen(false)} value={selectedProject} hasProject={hasProject} />;
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
  );
};

export default SearchHeader;
