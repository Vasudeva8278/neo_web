import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEdit, FaDownload, FaTrash, FaEllipsisV } from 'react-icons/fa';
import thumbnailImg from '../../Assets/thumbnail.png';

const Card = ({ project, thumbnail, onEdit }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleEditProject = () => {
    onEdit(project);
    setMenuOpen(false);
  };

  const closeProject = () => {
    console.log("closing project");
  };

  const viewTemplates = (project) => {
    navigate(`/projects/${project._id}`, { state: { data: project } });
    setMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between w-full sm:w-48 md:w-64 relative bg-white" style={{ height: '320px' }}>
      {/* Menu Button */}
      <div className="flex justify-end relative">
        <div ref={menuRef} className="relative z-20">
          <button
            className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Project options"
          >
            <FaEllipsisV className="w-3 h-3" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-30">
              <div className="py-1" role="menu">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  onClick={handleEditProject}
                  role="menuitem"
                >
                  <FaEdit className="mr-3 w-4 h-4" /> 
                  Edit Project
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => viewTemplates(project)}
                  role="menuitem"
                >
                  <FaFileAlt className="mr-3 w-4 h-4" /> 
                  View Templates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Thumbnail */}
      <div className="flex-1 mb-4">
        <div className="h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {thumbnail && thumbnail !== null && thumbnail !== undefined ? (
            <img 
              src={`data:image/png;base64,${thumbnail}`} 
              alt={`${project.projectName} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={thumbnailImg} 
              alt="Default thumbnail"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Project Name */}
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-800 truncate" title={project.projectName}>
          {project.projectName}
        </div>
      </div>
    </div>
  );
};

const ProjectCards = ({ projects, onEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {projects?.map((project) => (
        <Card
          project={project}
          key={project._id}
          projectId={project._id}
          name={project.fileName}
          thumbnail={project.thumbnail}
          onEdit={onEdit}
        />
      ))})
    </div>
  );
};

export default ProjectCards;
