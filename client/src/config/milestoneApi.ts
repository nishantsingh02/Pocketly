// milestoneApi.ts

import axios from "axios";


const Backend_url = import.meta.env.VITE_PRODUCTION_BACKEND_URL;

const getToken = () => localStorage.getItem("token");

export const getMilestones = async (userId: string) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${Backend_url}/milestones/${userId}`, { headers });
  return response.data;
};

export const createMilestone = async (userId: string, task: string, reward: string) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${Backend_url}/milestones/${userId}`, { task, reward }, { headers });
  return response.data;
};

export const markAsCompleted = async (id: number) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.patch(`${Backend_url}/milestones/${id}`, {}, { headers });
  return response.data;
};

export const deleteMilestone = async (id: number) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${Backend_url}/milestones/${id}`, { headers });
  return response.data;
};

export const editMilestone = async (id: number, task: string, reward: string) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${Backend_url}/milestones/${id}`, { task, reward }, { headers });
  return response.data;
};

