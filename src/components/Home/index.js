import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ProjectProvider } from "../../context/ProjectContext";
import TemplateProvider from "../../context/TemplateContext";
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
import ExportDocument from "../../pages/ExportDocument";

const Home = () => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  // Toggle Navigation visibility
  const toggleNavigation = () => {
    setIsNavigationVisible((prevState) => !prevState);
  };

  return (
    <ProjectProvider>
      <TemplateProvider>
        <div className="flex flex-col h-screen bg-gray-50">
          <Header toggleNavigation={toggleNavigation} />
          <div className="flex overflow-hidden">
            {isNavigationVisible && <Navigation />}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                <Route path="/export/:projectId/:id" element={<ExportComponent />} />
                <Route path="/export/:templateId" element={<ExportDocument />} />

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
            </main>
          </div>
        </div>
      </TemplateProvider>
    </ProjectProvider>
  );
};

export default Home;
