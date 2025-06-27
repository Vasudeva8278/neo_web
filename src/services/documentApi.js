import axios from "axios";
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create Document

export const createDocument = async (formData) => {
  try {
    const response = await api.post(`/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while creating document in createDocument:", error);
    throw error;
  }
};

// Update Document
export const updateDocument = async (projectId, formData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating document", error);
    throw error;
  }
};

// Delete Document
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/document/delete-doc/${documentId}`);
    return response;
  } catch (error) {
    console.error("Failed to delete document", error);
    throw error;
  }
};

// Update Document Highlight Text
export const updateDocHighlightText = async (documentId, updatedDoc) => {
  try {
    const response = await api.put(
      `/document/update-content/${documentId}`,
      updatedDoc
    );
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Failed to update document highlight text", error);
    throw error;
  }
};

// Get All Documents (Projects)
export const getAllDocuments = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error while fetching all documents", error);
    throw error;
  }
};

// Get Document by ID
export const getDocumentById = async (documentId) => {
  try {
    const response = await api.get(`/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching document by ID", error);
    throw error;
  }
};

// Get Documents by Template ID
export const getDocumentsByTemplateId = async (templateId) => {
  try {
    const response = await api.get(
      `/document/template-documents/${templateId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching documents by template ID", error);
    throw error;
  }
};

// Get Documents by Template ID
export const getDocumentsListByTemplateId = async (projectId, templateId) => {
  try {
    const response = await api.get(
      `/document/${projectId}/template-documents/${templateId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching documents list by template ID", error);
    throw error;
  }
};

// Get Home Page Documents
export const getHomePageDocuments = async (projectId) => {
  try {
    const response = await api.get(
      `/projectDocs/${projectId}/documents/documents-with-template-names`
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching home page documents", error);
    throw error;
  }
};

// Get 
export const getDocumentsWithTemplateNames = async () => {
  try {
    const response = await api.get(
      `document/documents-with-template-names`
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching documents with template names", error);
    throw error;
  }
};

// Download Document
export const downloadDocument = async (documentId, fileName) => {
  try {
    const response = await api.post(
      `/document/${documentId}/download`,
      null,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName.trim()}.docx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return "Success";
  } catch (error) {
    console.error("Error while downloading document", error);
    throw error;
  }
};

// Update Document Content
export const updateDocumentContent = async (documentId, content) => {
  try {
    const response = await api.put(
      `/document/update-content/${documentId}`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating document content", error);
    throw error;
  }
};

// Delete Document (Alternative method)
export const deleteDocument1 = async (documentId) => {
  try {
    const response = await api.delete(`/documents/delete-doc/${documentId}`);
    return response;
  } catch (error) {
    console.error("Failed to delete document", error);
    throw error;
  }
};

// Add New Document
export const addNewDocument = async (newDoc) => {
  try {
    // newDoc must include pid (project/template id)
    const { pid, ...payload } = newDoc;
    const response = await api.post(`/document/add-document/${pid}`, payload);
    return response.data;
  } catch (error) {
    console.error('Add failed:', error.response ? error.response.data : error);
    toast.error(error.response?.data?.message || 'Add failed');
    throw error;
  }
};

// Generate Zip File
export const generateZipFile = async (documentObj, filename) => {
  try {
    const response = await api.post(
      `/document/zip-documents`,
      documentObj,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    console.log("Documents zipped successfully.");
    return "Success";
  } catch (error) {
    console.error("Error while generating zip file", error);
    throw error;
  }
};

// Export Document
export const exportDocument = async (documentId) => {
  try {
    const response = await api.post(`/documents/${documentId}`, null, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while exporting document", error);
    throw error;
  }
};

// Download Document (Alternative method)
export const downloadDocument1 = async (documentId) => {
  try {
    const response = await api.post(`/documents/${documentId}/download`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error while downloading document", error);
    throw error;
  }
};

export const createDocsMultipleTemplates = async (updatedTemplatesData) => {
  try {
    const response = await api.post("/projectDocs/create-multiDocs/", {
      templates: updatedTemplatesData,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error while downloading document", error);
    throw error;
  }
};

export const sendDocumentViaEmail = async (documentId) => {
  try {
    const response = await api.get(`/projectDocs/email-document/${documentId}`);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error while emailing document", error);
    throw error;
  }
};

export const updateTemplateContent = async (templateId, content) => {
  try {
    const response = await api.put(
      `/templates/update-content/${templateId}`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating document content", error);
    throw error;
  }
};
