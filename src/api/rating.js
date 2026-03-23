const BASE_URL = import.meta.env.VITE_API_URL + "/api/v2/playlists";

export const ratePlaylist = async (playlistId, rating) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/rate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rating }),
    }
  );

  if (!res.ok) throw new Error("Failed to rate playlist");
  return res.json();
};
