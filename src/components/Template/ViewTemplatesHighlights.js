import React, { useEffect, useState, useContext } from "react";
import { getTemplatesAndHighlightsWithinProject } from "../../services/projectApi";
import { createDocsMultipleTemplates, createDocument } from "../../services/documentApi";
import { useNavigate, useLocation } from "react-router-dom";
import imgIcon from "../../Assets/imgIcon.jpg";
import tableIcon from "../../Assets/tableIcon.png";
import ClientHighlightsModal from "../Client/ClientHighlightsModal";
import NeoModal from "../NeoModal";
import { getClientDetails, createClient, createClientWithDocuments } from "../../services/clientsApi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewTemplatesHighlights = () => {
  const location = useLocation();
  const projectData = location.state?.project;
  const client = location.state?.client;
  const docName = client?.name;
  const clientId = client?._id;
  console.log(clientId);
  const clientTemplateIds = client?.documents?.map((doc) => doc.templateId._id);
  const navigate = useNavigate();

  const [templatesData, setTemplatesData] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [documentName, setDocumentName] = useState(docName || "");
  const [activeTab, setActiveTab] = useState("Texts");
  const [error, setError] = useState("");
  const [tempError, setTempError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [preSelected, setPreSelected] = useState(clientTemplateIds || []);
  const [clientDetails, setClientDetails] = useState("");
  const clientNameFromState = location.state?.clientName;
  const [isDocSuccessModalOpen, setIsDocSuccessModalOpen] = useState(false);
  const [createdDocInfo, setCreatedDocInfo] = useState(null);
  const [clientName, setClientName] = useState(clientNameFromState || "");

  useEffect(() => {
    const fetchClientDetails = async (clientId) => {
      console.log("in fetchClientDetails");
      try {
        const data = await getClientDetails(clientId);
        console.log(data.details);
        setClientDetails(data.details);
      } catch (err) {
        console.log(err);
        //setError(err.message);
      } finally {
        // setLoading(false);
      }
    };
    if (clientId) {
      console.log("in useEffect Client");
      fetchClientDetails(clientId);
    }
  }, [clientId]);

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    navigate(`/projects/${projectData._id}`, {
      state: { data: projectData },
    });
  };

  const handleSubmit = async () => {
    try {
      // 1. Create the document(s) using the correct endpoint
      const highlightsArray = Object.values(highlights).map(h => ({
        labels: [{ label: h.label, value: h.text }],
        type: h.type || "text",
        content: h.content || ""
      }));
      console.log("Posting highlights:", highlightsArray);
      const docPayload = {
        fileName: documentName,
        content: selectedTemplates.map(templateId => {
          const template = templatesData.find(t => t._id === templateId);
          return template.content;
        }).join("\n"),
        templateId: selectedTemplates[0],
        projectId: projectData._id,
        variables: [
          // REMOVE static values!
        ],
        thumbnail: templatesData.find(t => t._id === selectedTemplates[0])?.thumbnail,
        locationUrl: templatesData.find(t => t._id === selectedTemplates[0])?.locationUrl,
        highlights: highlightsArray
      };
      const docRes = await createDocsMultipleTemplates([docPayload]);
      const createdDoc = docRes.documents[0];
      setCreatedDocInfo(createdDoc);
      setIsDocSuccessModalOpen(true); // Show modal
    } catch (error) {
      toast.error("Error creating document: " + (error?.response?.data?.message || "Server error"));
    }
  };

  const fetchTemplatesData = async (projectId) => {
    try {
      const data = await getTemplatesAndHighlightsWithinProject(projectId);
      if (data && data.length === 0) {
        setAlertText(
          "There are no templates available in this Project. \n Please select another project or create templates first."
        );
        setIsAlertOpen(true);
        return;
      }
      setTemplatesData(data);

      // Pre-select templates matching clientTemplateIds
      const preSelectedTemplates = data
        .filter((template) => clientTemplateIds?.includes(template._id))
        .map((template) => template._id);
      //setSelectedTemplates(preSelectedTemplates);
    } catch (error) {
      console.error("Error fetching templates data:", error);
    }
  };

  const handleCancel = () => {
    /*  navigate(`/projects/${projectData._id}`, {
      state: { data: projectData },
    }); */
    navigate(-1);
  };

  useEffect(() => {
    if (projectData?._id) {
      fetchTemplatesData(projectData._id);
    }
  }, [projectData]);

  const handleCheckboxChange = (templateId, isChecked) => {
    setTempError("");
    const updateHighlights = (templates) => {
      const highlightsMap = {};
      templates.forEach((template) => {
        template.highlights.forEach((highlight) => {
          if (!highlightsMap[highlight.label]) {
            let matchingClientDetail = "";
            if (clientDetails) {
              matchingClientDetail = clientDetails?.find(
                (clientDetail) => clientDetail.label === highlight.label
              );
            }
            console.log(matchingClientDetail);
            highlightsMap[highlight.label] = {
              ...highlight,
              text: matchingClientDetail
                ? matchingClientDetail.value
                : highlight.text,
            };
          }
        });
      });
      return highlightsMap;
    };
    console.log(preSelected);
    if (isChecked) {
      setPreSelected((prev) => [...prev, templateId]);
      setSelectedTemplates((prev) => {
        const updatedTemplates = [...prev, templateId];
        const updatedHighlights = updateHighlights(
          templatesData.filter((template) =>
            updatedTemplates.includes(template._id)
          )
        );
        setHighlights(updatedHighlights);
        return updatedTemplates;
      });
    } else {
      setPreSelected((prev) => prev.filter((id) => id !== templateId));
      setSelectedTemplates((prev) => {
        const updatedTemplates = prev.filter((id) => id !== templateId);
        const updatedHighlights = updateHighlights(
          templatesData.filter((template) =>
            updatedTemplates.includes(template._id)
          )
        );
        setHighlights(updatedHighlights);
        return updatedTemplates;
      });
    }
  };

  const handleTableAndTextHighlight = (highlight) => {
    setIsModalOpen(true);
    setCurrentHighlight(highlight);
  };

  const handleHighlightChange = (label, newValue) => {
    console.log(label, newValue);
    setHighlights((prev) => ({
      ...prev,
      [label]: { ...prev[label], text: newValue },
    }));

    setTemplatesData((prev) =>
      prev.map((template) => ({
        ...template,
        highlights: template.highlights.map((highlight) =>
          highlight.label === label
            ? { ...highlight, text: newValue }
            : highlight
        ),
      }))
    );
  };

  // Separate highlights by type
  const textHighlights = Object.values(highlights).filter(
    (highlight) => highlight.type === "text"
  );
  const tableHighlights = Object.values(highlights).filter(
    (highlight) => highlight.type === "table"
  );
  const imageHighlights = Object.values(highlights).filter(
    (highlight) => highlight.type === "image"
  );

  const renderHighlights = () => {
    const highlightsByTab = {
      Texts: textHighlights,
      Tables: tableHighlights,
      Images: imageHighlights,
    };

    const currentHighlights = highlightsByTab[activeTab];

    if (!currentHighlights || currentHighlights.length === 0) {
      return (
        <div className='text-gray-500 text-center'>
          No highlights. Please select any template.
        </div>
      );
    }

    return (
      <ul className='pl-5 space-y-4'>
        {currentHighlights.map((highlight) => (
          <li
            key={highlight.label}
            className='flex flex-col md:flex-row md:items-center gap-4 pb-4'
          >
            <strong className='w-full md:w-1/4 text-gray-700 capitalize'>
              {highlight.label}:
            </strong>
            {activeTab === "Texts" ? (
              <input
                type='text'
                value={highlight.text}
                onChange={(e) =>
                  handleHighlightChange(highlight.label, e.target.value)
                }
                className='border rounded px-3 py-2 text-sm w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            ) : activeTab === "Tables" ? (
              <div className='w-full md:w-3/4 flex items-center gap-4'>
                <button
                  onClick={() => handleTableAndTextHighlight(highlight)}
                  className='mt-2'
                >
                  <img
                    src={tableIcon}
                    className='w-10 h-10'
                    title={highlight.label}
                  />
                </button>
              </div>
            ) : (
              <div className='w-full md:w-3/4 flex items-center gap-4'>
                {highlight.text && (
                  <>
                    <button
                      onClick={() => handleTableAndTextHighlight(highlight)}
                      className='mt-2'
                    >
                      <img
                        src={imgIcon}
                        className='w-10 h-10'
                        title={highlight.label}
                      />
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleCreateClientAfterDoc = async () => {
    let clientPayload;
    try {
      const { templateId, _id: documentId } = createdDocInfo;
      clientPayload = {
        name: clientName,
        documents: [{ templateId, documentId }]
      };
      console.log("Client payload:", clientPayload);
      await createClientWithDocuments(clientPayload);
      toast.success("Client created successfully!");
      setIsDocSuccessModalOpen(false);
      navigate(`/projects/${projectData._id}`, {
        state: { data: projectData },
      });
    } catch (error) {
      console.log("Client creation error:", error, clientPayload);
      toast.error("Error creating client: " + (error?.response?.data?.message || "Server error"));
    }
  };

  const handleCreateClient = (projectData) => {
    navigate('/viewAllHighlights', {
      state: { 
        project: projectData,
        clientName: projectData.projectName // Pass project name as client name
      },
    });
  };

  return (
    <div className='bg-gray-100 p-6'>
      <div className='flex gap-4 mb-4'>
        <div className='w-1/4'>
          <h2 className='text-lg font-semibold'>{projectData.projectName}</h2>
        </div>
        <div className='w-3/4'>
          <input
            type='text'
            className='w-full border rounded px-3 py-2 text-sm'
            placeholder='Enter document name'
            value={documentName}
            onChange={(e) => {
              setError("");
              setDocumentName(e.target.value);
            }}
            readOnly={docName ? true : false}
          />
          <span style={{ color: "red" }}>{error || ""}</span>
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='w-1/4 bg-white rounded-lg shadow p-4'>
          <h2 className='text-lg font-semibold mb-4'>Templates</h2>
          <ul className='space-y-2'>
            <span style={{ color: "red" }}>{tempError || ""}</span>
            {templatesData.map((template) => (
              <li key={template._id}>
                <label className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='rounded text-blue-500 focus:ring-blue-300'
                    checked={preSelected?.includes(template._id)}
                    disabled={clientTemplateIds?.includes(template._id)}
                    onChange={(e) =>
                      handleCheckboxChange(template._id, e.target.checked)
                    }
                  />
                  <span>{template.fileName}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className='w-3/4 bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold mb-4'>Highlights</h2>
          <div className='mb-4'>
            <ul className='flex space-x-4 border-b pb-2'>
              {["Texts", "Tables", "Images"].map((tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer px-4 py-2 ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-500 border-b-2 font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
          {renderHighlights()}
        </div>
      </div>
      <div className='mt-4 flex justify-end space-x-4'>
        <button
          className='bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-300'
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className='bg-gray-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-300'
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
      <div>
        <ClientHighlightsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleHighlightChange}
          highlight={currentHighlight}
        />
      </div>
      <NeoModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)}>
        <div className='bg-white p-6 rounded-lg  max-w-sm mx-auto '>
          <p className='text-gray-800 text-lg font-semibold mb-4'>
            {alertText}
          </p>
          <div className='flex justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
              onClick={handleAlertClose}
            >
              Close
            </button>
          </div>
        </div>
      </NeoModal>
      <NeoModal isOpen={isDocSuccessModalOpen} onClose={() => setIsDocSuccessModalOpen(false)}>
        <div className='bg-white p-6 rounded-lg max-w-sm mx-auto'>
          <p className='text-gray-800 text-lg font-semibold mb-4'>
            Document created successfully!
          </p>
          <div className='flex justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
              onClick={handleCreateClientAfterDoc}
            >
              OK
            </button>
          </div>
        </div>
      </NeoModal>
      <ToastContainer />
    </div>
  );
};

export default ViewTemplatesHighlights;