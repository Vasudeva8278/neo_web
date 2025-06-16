import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  FaHome,
  FaBuilding,
  FaUser,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaRegFolderOpen,
  FaDotCircle,
} from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiLayout4Line } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { HiOutlineUserGroup } from "react-icons/hi";
import photo from "../Assets/general_profile.png";
import NeoModal from "./NeoModal";
import NeoProject from "../pages/NeoProject";
import Inbox from "./Inbox";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isProjectActive = (projectId) => location.pathname === `/projects/${projectId}`;

  const handleProjects = () => {
    navigate(`/projects`);
  };

  const handleClients = () => {
    navigate("/clients");
  };

  const handleTemplates = () => {
    navigate(`/Neo`);
  };

  const gotoHome = () => {
    navigate("/Home");
  };

  const handleProjectsTemplates = (project) => {
    navigate(`/projects/${project._id}`, { state: { data: project } });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    navigate(`/projects`);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Helper function to render navigation items
  const NavItem = ({ to, onClick, icon: Icon, label, projectSpecific = false, projectId = null }) => {
    const active = projectSpecific
      ? isProjectActive(projectId)
      : isActive(to) || (to === "/projects" && location.pathname.startsWith("/projects/") && !projectId);

    return (
      <li className="w-full flex justify-center"> {/* Centering within the width */}
        <div
          onClick={onClick || (() => navigate(to))}
          className={`
            flex flex-col items-center rounded-lg cursor-pointer w-full transition duration-200
            hover:bg-blue-100 
            ${active ? "shadow-md shadow-blue-300 bg-blue-50" : ""}
            ${isMobile ? 'p-0.5' : 'p-2'}
          `}
          title={isMobile ? label : ''} // Show tooltip on mobile
        >
          <Icon className={`${isMobile ? 'w-3 h-3' : 'w-5 h-5'} ${!isMobile ? 'mb-1' : ''} ${active ? "text-blue-600" : "text-gray-700"}`} />
          {!isMobile && (
            <span className={`text-xs font-semibold text-center ${active ? "text-blue-600" : "text-gray-700"}`}>
              {label}
            </span>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className={`flex h-full fixed top-0 left-0 w-full mt-16 ${isMobile ? 'z-50' : ''}`}>
      <div className={`relative border-r border-gray-300 flex flex-col bg-gray-100 h-full transition-all duration-300 ${
        isMobile ? 'w-12' : 'w-20'
      }`}>
        {/* User Profile Section */}
        <div className={`flex flex-col items-center w-full border-b border-gray-300 ${
          isMobile ? 'py-2' : 'py-4'
        }`}>
          <img
            src={user?.profilePic || photo}
            alt='Profile'
            className={`rounded-full mb-1 cursor-pointer border-2 border-transparent hover:border-blue-400 transition-colors duration-200 ${
              isMobile ? 'w-6 h-6' : 'w-12 h-12'
            }`}
            onClick={handleProfileClick}
          />
          {!isMobile && (
            <div className='text-center text-gray-800'>
              <div className='text-sm font-semibold truncate w-full px-1'>{user.name}</div>
            </div>
          )}
          {!isMobile && <MdArrowDropDown className='w-6 h-6 mt-2 text-gray-600' />}
        </div>

        {/* Main Navigation Items */}
        <nav className={`flex flex-col items-center ${
          isMobile ? 'py-2 space-y-2' : 'py-4 space-y-4'
        }`}>
          <ul className={`w-full flex flex-col items-center ${
            isMobile ? 'space-y-1' : 'space-y-2'
          }`}>
            <NavItem to="/Home" icon={GoHome} label="Home" />

            <li className="w-full flex flex-col items-center">
                <div
                    onClick={handleProjects}
                    className={`
                        flex flex-col items-center p-2 rounded-lg cursor-pointer w-full
                        hover:bg-blue-100 transition duration-200
                        ${isActive("/projects") && !location.pathname.startsWith("/projects/") ? "shadow-md shadow-blue-300 bg-blue-50" : ""}
                    `}
                >
                    <FaRegFolderOpen className={`w-5 h-5 mb-1 ${isActive("/projects") && !location.pathname.startsWith("/projects/") ? "text-blue-600" : "text-gray-700"}`} />
                    <span className={`text-xs font-semibold text-center ${isActive("/projects") && !location.pathname.startsWith("/projects/") ? "text-blue-600" : "text-gray-700"}`}>
                        Projects
                    </span>
                </div>
                <div
                    className='mt-1 cursor-pointer hover:text-blue-600 transition-colors duration-200'
                    onClick={() => setIsModalOpen(true)}
                    title='Add new Project'
                >
                    <IoIosAddCircleOutline className='w-5 h-5 text-gray-600 hover:text-blue-600' />
                </div>
            </li>




            <NavItem to="/clients" onClick={handleClients} icon={HiOutlineUserGroup} label="Clients" />
            <NavItem to="/Neo" onClick={handleTemplates} icon={RiLayout4Line} label="Template" />

            {/* Admin/SuperAdmin specific features */}
            {user && user?.features?.includes("viewDashboard") && (
              <NavItem to="/dashboard" icon={FaHome} label="Dashboard" />
            )}
            {user && user?.features?.includes("viewOrganizations") && (
              <NavItem to="/organizations" icon={FaBuilding} label="Organizations" />
            )}
            {user && user?.features?.includes("viewProfile") && (
              <NavItem to="/profile" icon={FaUser} label="Profile" />
            )}
          </ul>
        </nav>

        {/* Logout Section at the bottom */}
        <div className={`w-full border-t border-gray-300 flex justify-center ${
          isMobile ? 'py-2' : 'py-4'
        }`}>
          <div
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className='flex flex-col items-center p-2 rounded-lg cursor-pointer w-full hover:bg-blue-100 transition duration-200'
          >
            <FaSignOutAlt className='w-5 h-5 mb-1 text-gray-700' />
            <span className='text-xs font-semibold text-center text-gray-700'>Logout</span>
          </div>
        </div>

        {/* Modal for New Project */}
        <NeoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NeoProject
            mode={"add"}
            project={""}
            onSave={handleSave}
            handleClose={handleCancel}
          />
        </NeoModal>
      </div>
     
    </div>
  );
};

export default Navigation;