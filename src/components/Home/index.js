import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ProjectProvider } from "../../context/ProjectContext";
import TemplateProvider from "../../context/TemplateContext";
import Layout from "../Layout/Layout";
import Header from "../Header";
import Navigation from "../Navigation";
import LandingPage from "../../pages/LandingPage.tsx";

// Import pages
import Dashboard from "../../pages/Dashboard";
import Projects from "../../pages/Projects";
import Clients from "../../pages/Clients";
import ViewClient from "../../pages/ViewClient";
import NeoProjectTemplates from "../NeoProjectTemplates";
import Neo from "../Neo";
import DocxToTextConverter from "../Template/DocxToTextConverter";
import DocumentView from "../Documents/DocumentView";
import DocumentContainer from "../Documents/DocumentContainer";
import ExportComponent from "../Documents/ExportComponent";
import ViewTemplatesHighlights from "../Template/ViewTemplatesHighlights";
import ProfileSettings from "../Profile/ProfileSettings";

const Home = () => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  // Toggle Navigation visibility
  const toggleNavigation = () => {
    setIsNavigationVisible((prevState) => !prevState);
  };

  return (
    <ProjectProvider>
      <TemplateProvider>
        <div className="flex flex-col h-screen">
          <Header toggleNavigation={toggleNavigation} className="sticky top-0 z-10" />
          <div className="flex-1 flex mt-2 overflow-auto">
            {isNavigationVisible && <Navigation />}
            <div className="flex-1 ml-12 lg:ml-20 mt-1 px-2 sm:px-4 lg:px-0">
              <Routes>
                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />

                {/* Templates */}
                <Route path="/Neo" element={<Neo />} />
                <Route path="/document/:id" element={<DocxToTextConverter />} />

                {/* Documents */}
                <Route path="/docview/:id" element={<DocumentView />} />
                <Route path="/docviewall/:id" element={<DocumentContainer />} />
                <Route path="/export/:id" element={<ExportComponent />} />

                {/* Landing Page */}
                <Route path="/Home" element={<LandingPage />} />

                {/* Clients */}
                <Route path="/clients" element={<Clients />} />
                <Route path="/viewclient" element={<ViewClient />} />

                {/* Projects */}
                <Route path="/projects/:id" element={<NeoProjectTemplates />} />
                <Route path="/viewAllHighlights" element={<ViewTemplatesHighlights />} />

                {/* Profile */}
                <Route path="/profile" element={<ProfileSettings />} />
              </Routes>
            </div>
          </div>
        </div>
      </TemplateProvider>
    </ProjectProvider>
  );
};

export default Home;
