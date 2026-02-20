const BASE_URL = "http://localhost:8000/api/v2/progress";

export const startVideo = async (playlistId, videoId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/start/${videoId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to start video");
  return res.json();
};

export const completeVideo = async (playlistId, videoId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/complete/${videoId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to complete video");
  return res.json();
};

export const updateVideoTime = async (
  playlistId,
  videoId,
  timeSpent
) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/time/${videoId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ timeSpent }),
    }
  );

  if (!res.ok) throw new Error("Failed to update time");
  return res.json();
};

export const fetchPlaylistProgress = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
};

export const updateVideoProgress = async (
  playlistId,
  videoId,
  seconds
) => {
  await fetch(
    `${BASE_URL}/${playlistId}/videos/${videoId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ seconds })
    }
  );
};
export const getVideoProgress = async (
  playlistId,
  videoId
) => {
  const res = await fetch(
   `${BASE_URL}/${playlistId}/videos/${videoId}`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) throw new Error("Progress fetch failed");
  return res.json();
};

export const markVideoCompleted = async (
  playlistId,
  videoId
) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/videos/${videoId}/complete`,
    {
      method: "PATCH",
      credentials: "include"
    }
  );

  if (!res.ok) throw new Error("Complete failed");
  return res.json();
};

export const getGoalStatus = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/goal`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Goal fetch failed");
  return res.json();
};

export const getStreak = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/streak`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Streak fetch failed");
  return res.json();
};

export const getProgressChart = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/chart`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Chart fetch failed");
  return res.json();
};

export const setPlaylistGoal = async (playlistId, data) => {
  const res = await fetch(
    `${BASE_URL}/${playlistId}/goal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) throw new Error("Goal set failed");
  return res.json();
};