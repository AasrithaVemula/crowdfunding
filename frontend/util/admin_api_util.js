import { apiFetch } from "./api_util";

export const fetchAdminSummary = () => apiFetch("api/admin/summary");

export const fetchAdminProjects = () => apiFetch("api/admin/projects");

export const fetchAdminUsers = () => apiFetch("api/admin/users");

export const deleteAdminProject = projectId =>
  apiFetch(`api/admin/projects/${projectId}`, {
    method: "DELETE"
  });

export const deleteAdminUser = userId =>
  apiFetch(`api/admin/users/${userId}`, {
    method: "DELETE"
  });