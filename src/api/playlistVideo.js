const BASE_URL = "http://localhost:8000/api/v2/playlists";

export const addVideoToPlaylist = async (playlistId, data) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add video");
  return res.json();
};

export const deleteVideoFromPlaylist = async (playlistId, videoId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/videos/${videoId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to delete video");
  return res.json();
};

export const reorderVideos = async (playlistId, orderedIds) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/reorder`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderedIds }),
    }
  );

  if (!res.ok) throw new Error("Failed to reorder");
  return res.json();
};

export const getVideoById = async (playlistId, videoId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/videos/${videoId}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch video");
  return res.json();
};



export const getVideoNote = async (playlistId, videoId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/video/${videoId}/note`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch note");
  return res.json();
};

export const saveVideoNote = async (playlistId, videoId, content) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/videos/${videoId}/note`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content })
    }
  );

  if (!res.ok) throw new Error("Failed to save note");
  return res.json();
};
export const importYoutubePlaylist = async (
  playlistId,
  youtubePlaylistId
) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/import`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ youtubePlaylistId })
    }
  );

  if (!res.ok) throw new Error("Import failed");
  return res.json();
};