const defaultHeaders = {
  "Content-Type": "application/json"
};

const buildError = (status, responseJSON) => ({
  status,
  responseJSON
});

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url.startsWith("/") ? url : `/${url}`, {
    credentials: "include",
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw buildError(response.status, data);
  }

  return data;
};
