import { apiFetch } from "./api_util";

export const signup = user =>
  apiFetch("api/users", {
    method: "POST",
    body: JSON.stringify({ user })
  });

export const login = user =>
  apiFetch("api/session", {
    method: "POST",
    body: JSON.stringify({ user })
  });

export const currentUser = () => apiFetch("api/session");

export const logout = () =>
  apiFetch("api/session", {
    method: "DELETE"
  });
