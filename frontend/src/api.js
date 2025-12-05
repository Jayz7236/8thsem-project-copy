const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = (path, options = {}) => {
  return fetch(`${API_URL}${path}`, options)
    .then((res) => res.json());
};
