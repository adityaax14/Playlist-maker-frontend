const BASE_URL = "http://localhost:8000/api/v2/analytics";

export const fetchPlaylistAnalytics = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/creator/${playlistId}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};
