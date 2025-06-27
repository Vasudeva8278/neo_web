import axios from "axios";
import { toast } from "react-toastify";

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

export const getAllClients = async () => {
  try {
    const response = await api.get("/clients");
    return response.data.data;
  } catch (error) {
    console.error("Error while fetching projects", error);
    throw error;
  }
};

export const getClientDetails = async (id) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error while fetching projects", error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await api.post("/clients/create-with-docs", clientData);
    return response.data;
  } catch (error) {
    console.error("Error while creating client", error);
    throw error;
  }
};

export const createClientWithDocuments = async (clientData) => {
  try {
    const response = await api.post("/clients/create-with-docs", clientData);
    return response.data;
  } catch (error) {
    console.log(clientData);
    console.error("Error while creating client with documents", error);
    throw error;
  }
};
