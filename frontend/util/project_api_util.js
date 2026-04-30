import { apiFetch } from "./api_util";

export const fetchProjects = projects =>
  apiFetch("api/projects");

export const fetchProject = projectId =>
  apiFetch(`api/projects/${projectId}`);

export const createProject = project =>
  apiFetch("api/projects", {
    method: "POST",
    body: JSON.stringify({ project })
  });

export const updateProject = project =>
  apiFetch(`api/projects/${project.id}`, {
    method: "PATCH",
    body: JSON.stringify({ project })
  });

export const deleteProject = projectId =>
  apiFetch(`api/projects/${projectId}`, {
    method: "DELETE"
  });

export const createBacking = backing =>
  apiFetch("api/backings", {
    method: "POST",
    body: JSON.stringify({ backing })
  });
