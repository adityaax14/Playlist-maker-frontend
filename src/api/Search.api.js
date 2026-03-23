const BASE_URL = import.meta.env.VITE_API_URL + "/api/v2";

export const searchPlaylists = async ({ q, page = 1, limit = 20, sort = "relevance" }) => {
  const params = new URLSearchParams({ q, page, limit, sort });
  const res    = await fetch(`${BASE_URL}/search/playlists?${params}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const searchVideos = async ({ q, page = 1, limit = 20 }) => {
  const params = new URLSearchParams({ q, page, limit });
  const res    = await fetch(`${BASE_URL}/search/videos?${params}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};