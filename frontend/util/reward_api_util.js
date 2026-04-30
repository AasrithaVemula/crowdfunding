import { apiFetch } from "./api_util";

export const fetchRewards = rewards =>
  apiFetch("api/rewards");

export const createReward = reward =>
  apiFetch("api/rewards", {
    method: "POST",
    body: JSON.stringify({ reward })
  });
