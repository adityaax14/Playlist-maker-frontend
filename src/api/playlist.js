const BASE_URL = import.meta.env.VITE_API_URL + "/api/v2/playlists";


export const fetchMyPlaylists = async () => {
  const res = await fetch(`${BASE_URL}/my`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json();
};

export const createPlaylist = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
};

export const fetchPlaylists = async (queryParams = "") => {
  const res = await fetch(`${BASE_URL}?${queryParams}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json();
};

export const getPlaylistById = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch playlist");
  return res.json();
};

export const updatePlaylist = async (playlistId, data) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const deletePlaylist = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};

export const explorePlaylists = async (params = "") => {
  const res = await fetch(`${BASE_URL}/explore?${params}`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to explore playlists");
  return res.json();
};

// trending playlists
export const getTrendingPlaylists = async () => {
  const res = await fetch(`${BASE_URL}/discover/trending`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch trending playlists");
  return res.json();
};

// top rated playlists
export const getTopRatedPlaylists = async () => {
  const res = await fetch(`${BASE_URL}/discover/top-rated`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch top rated playlists");
  return res.json();
};

// newest playlists
export const getNewestPlaylists = async () => {
  const res = await fetch(`${BASE_URL}/discover/new`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch newest playlists");
  return res.json();
};

export const savePlaylist = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/saved/${playlistId}`,
    {
      method: "POST",
      credentials: "include"
    }
  );

  if (!res.ok) throw new Error("Failed to save playlist");
  return res.json();
};

export const removeSavedPlaylist = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/saved/${playlistId}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  );

  if (!res.ok) throw new Error("Failed to remove saved playlist");
  return res.json();
};

export const getSavedPlaylists = async () => {
  const res = await fetch(
    `${BASE_URL}/saved`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) throw new Error("Failed to fetch saved playlists");
  return res.json();
};

export const ratePlaylist = async (playlistId, rating) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/ratings`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ rating })
    }
  );

  return res.json();
};

export const deleteRating = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/rate`,
    {
      method: "DELETE",
      credentials: "include"
    }
  );

  return res.json();
};