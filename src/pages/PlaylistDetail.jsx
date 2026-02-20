import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addVideoToPlaylist,
  deleteVideoFromPlaylist,
  getVideoNote,
  saveVideoNote,
  importYoutubePlaylist
} from "../api/playlistVideo.js";
import { getPlaylistById } from "../api/playlist.js";
import "../styles/playlistDetail.css";
import YouTube from "react-youtube";
import {
  updateVideoProgress,
  getVideoProgress,
  fetchPlaylistProgress,
  markVideoCompleted,
  setPlaylistGoal,
  getGoalStatus,
  getStreak,
  getProgressChart
} from "../api/progress.js";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function PlaylistDetail() {
  const { playlistId, videoId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [videoInput, setVideoInput] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [note, setNote] = useState("");

  const [player, setPlayer] = useState(null);
  const [savedTime, setSavedTime] = useState(0);
  const [hasSeeked, setHasSeeked] = useState(false);

  const [playlistProgress, setPlaylistProgress] = useState(0);
  const [progressMap, setProgressMap] = useState({});
  const [lastVideoId, setLastVideoId] = useState(null);
  const [goalData, setGoalData] = useState(null);
const [streak, setStreak] = useState(0);
const [chartData, setChartData] = useState([]);
const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const [goalType, setGoalType] = useState("days");
  const [targetDays, setTargetDays] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  /* ---------------- Load Playlist ---------------- */
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const res = await getPlaylistById(playlistId);
        const data = res.data;
        setPlaylist(data);

        if (data.videos?.length > 0) {
          const selected =
            data.videos.find((v) => v._id === videoId) ||
            data.videos[0];

          setActiveVideo(selected);

          if (!videoId) {
            navigate(`/playlist/${playlistId}/${selected._id}`, {
              replace: true
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPlaylist();
  }, [playlistId, videoId, navigate]);

  

  // Find current video index
const currentIndex = playlist?.videos?.findIndex(
  (v) => v._id === activeVideo?._id
);

// Previous video
const handlePrev = () => {
  if (currentIndex > 0) {
    const prevVideo = playlist.videos[currentIndex - 1];
    navigate(`/playlist/${playlistId}/${prevVideo._id}`);
  }
};

// Next video
const handleNext = () => {
  if (currentIndex < playlist.videos.length - 1) {
    const nextVideo = playlist.videos[currentIndex + 1];
    navigate(`/playlist/${playlistId}/${nextVideo._id}`);
  }
};

  const handleAddVideo = async () => {
  if (!videoInput) return;

  try {
    const url = new URL(videoInput);
    const videoIdParam = url.searchParams.get("v");
    const playlistIdParam = url.searchParams.get("list");

    if (playlistIdParam) {
      await importYoutubePlaylist(
        playlistId,
        playlistIdParam
      );
    } else if (videoIdParam) {
      await addVideoToPlaylist(playlistId, {
        youtubeVideoId: videoIdParam
      });
    }

    window.location.reload();
  } catch {
    alert("Invalid YouTube link");
  }
};

  /* ---------------- Load Note ---------------- */
  useEffect(() => {
    if (!videoId) return;

    const loadNote = async () => {
      try {
        const res = await getVideoNote(playlistId, videoId);
        setNote(res.data?.content || "");
      } catch {
        setNote("");
      }
    };

    loadNote();
  }, [playlistId, videoId]);

  const handleSaveNote = async () => {
    if (!videoId) return;
    await saveVideoNote(playlistId, videoId, note);
    alert("Note saved");
  };

  /* ---------------- Load Single Video Progress ---------------- */
  useEffect(() => {
    if (!activeVideo) return;

    const loadProgress = async () => {
      try {
        const res = await getVideoProgress(
          playlistId,
          activeVideo._id
        );
        setSavedTime(res.data?.watchedSeconds || 0);
      } catch {
        setSavedTime(0);
      }
    };

    loadProgress();
  }, [activeVideo, playlistId]);

  /* ---------------- Load Playlist Progress ---------------- */
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetchPlaylistProgress(playlistId);

        setPlaylistProgress(res.data.percent || 0);
        setProgressMap(res.data.videoProgress || {});
        setLastVideoId(res.data.lastVideoId);
      } catch {
        setPlaylistProgress(0);
        setProgressMap({});
        setLastVideoId(null);
      }
    };

    loadProgress();
  }, [playlistId, activeVideo]);

  /* ---------------- Toggle Completed ---------------- */
  const handleMarkCompleted = async (videoId) => {
    try {
      const res = await markVideoCompleted(playlistId, videoId);
      const completed = res.data.completed;

      const updatedMap = {
        ...progressMap,
        [videoId]: {
          ...(progressMap[videoId] || {}),
          completed,
          seconds: completed ? 9999 : 1
        }
      };

      setProgressMap(updatedMap);

      const total = playlist.videos.length;
      const completedCount = Object.values(updatedMap).filter(
        (p) => p.completed
      ).length;

      setPlaylistProgress(
        Math.round((completedCount / total) * 100)
      );
    } catch (err) {
      console.error("Complete toggle failed", err);
    }
  };

  /* Reset seek flag */
  useEffect(() => {
    setHasSeeked(false);
  }, [activeVideo]);

  /* ---------------- Progress Sync ---------------- */
  useEffect(() => {
    if (!player || !activeVideo) return;

    let lastSent = 0;

    const interval = setInterval(async () => {
      try {
        const state = player.getPlayerState();
        if (state !== 1) return;

        const currentTime = Math.floor(
          player.getCurrentTime()
        );

        if (currentTime > lastSent + 5) {
          lastSent = currentTime;

          await updateVideoProgress(
            playlistId,
            activeVideo._id,
            currentTime
          );
        }
      } catch {}
    }, 10000);

    return () => clearInterval(interval);
  }, [player, activeVideo, playlistId]);

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }
   /* ---------------- Load Analytics ---------------- */
  const loadAnalytics = async () => {
    try {
      const goalRes = await getGoalStatus(playlistId);
      const streakRes = await getStreak(playlistId);
      const chartRes = await getProgressChart(playlistId);

      setGoalData(goalRes.data);
      setStreak(streakRes.streak || 0);
      setChartData(chartRes);
    } catch (err) {
      console.error("Analytics load failed", err);
    }
  };

  /* ---------------- Set Goal ---------------- */
  const handleSetGoal = async () => {
  try {
    const payload =
      goalType === "days"
        ? { goalType, targetDays: Number(targetDays) }
        : { goalType, dailyTargetHours: Number(dailyHours) };

    await setPlaylistGoal(playlistId, payload);

    setShowGoalModal(false);
    await loadAnalytics();
    setShowAnalytics(true);
  } catch (err) {
    console.error(err);
    alert("Failed to set goal");
  }
};

  if (!playlist) return <p>Loading...</p>;

  return (
    <div className="playlist-page">
      <div className="playlist-header">
       
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Playlists
        </button>
        <div className="streak-badge">
          🔥 {streak} Day Streak
        </div>

        {lastVideoId && (
          <button
            className="continue-btn"
            onClick={() =>
              navigate(`/playlist/${playlistId}/${lastVideoId}`)
            }
          >
            ▶ Continue Watching
          </button>
        )}

        <h1 className="playlist-title-glow">
          {playlist.title}
        </h1>

        <div className="playlist-progress">
          <div className="playlist-progress-bar">
            <div
              className="playlist-progress-fill"
              style={{ width: `${playlistProgress}%` }}
            />
          </div>
          <span>{playlistProgress}% completed</span>
        </div>

      </div>
       <div className="goal-buttons">
        <button
          className="set-goal-btn"
          onClick={() => setShowGoalModal(true)}
        >
          🎯 Set Goal
        </button>

        <button
          className="track-goal-btn"
          onClick={() => {
            setShowAnalytics(!showAnalytics);
            if (!showAnalytics) loadAnalytics();
          }}
        >
          📊 Track Goal
        </button>
      </div>
      {showAnalytics && goalData && (
        <>
          <div className="analytics-container">
            <div className="analytics-card">
              <h3>Goal Status</h3>
              <p>
                {goalData.status.toUpperCase()}
              </p>
            </div>

            <div className="analytics-card">
              <h3>Daily Required</h3>
              <p>
                {(goalData.newRequiredPerDay / 3600).toFixed(1)}h
              </p>
            </div>

            <div className="analytics-card">
              <h3>Burn Rate</h3>
              <p>{goalData.burnRateMinutes} min/day</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#00ffd0"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
     <div className="add-video-box">
  <input
    type="text"
    placeholder="Paste YouTube video or playlist URL"
    value={videoInput}
    onChange={(e) => setVideoInput(e.target.value)}
  />
  <button onClick={handleAddVideo}>
    Add
  </button>
</div>
{showGoalModal && (
  <div className="goal-modal">
    <div className="goal-modal-content">
      <h2>Set Your Goal</h2>

      <select
        value={goalType}
        onChange={(e) => setGoalType(e.target.value)}
      >
        <option value="days">Finish in X Days</option>
        <option value="daily_hours">Daily Hours Target</option>
      </select>

      {goalType === "days" && (
        <input
          type="number"
          placeholder="Enter number of days"
          value={targetDays}
          onChange={(e) => setTargetDays(e.target.value)}
        />
      )}

      {goalType === "daily_hours" && (
        <input
          type="number"
          placeholder="Enter hours per day"
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
        />
      )}

      <div className="goal-modal-buttons">
        <button onClick={handleSetGoal}>
          Save Goal
        </button>

        <button
          onClick={() => setShowGoalModal(false)}
          className="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {/* PLAYER + NOTES */}
      <div className="player-layout">
        <div className="video-player">
          {activeVideo && (
            <YouTube
              videoId={activeVideo.youtubeVideoId}
              opts={{ width: "100%", height: "460" }}
              onReady={(e) => setPlayer(e.target)}
              onStateChange={(e) => {
                if (
                  !hasSeeked &&
                  savedTime > 0 &&
                  (e.data === 1 ||
                    e.data === 2 ||
                    e.data === 5)
                ) {
                  e.target.seekTo(savedTime, true);
                  setHasSeeked(true);
                }
              }}
            />
          )}

           <div className="lesson-navigation">
  <button
    onClick={handlePrev}
    disabled={currentIndex <= 0}
    className="nav-btn"
  >
    ⬅ Previous
  </button>
  

  <button
    onClick={handleNext}
    disabled={
      currentIndex >= playlist.videos.length - 1
    }
    className="nav-btn primary"
  >
    Next ➡
  </button>
</div>
        </div>
        
        <div className="notes-panel">
          <h3>Personal Notes</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write notes for this video..."
          />
          <button
            className="save-note-btn"
            onClick={handleSaveNote}
          >
            Save Note
          </button>
        </div>
      </div>

      {/* VIDEO LIST */}
      <div className="video-list">
        {playlist.videos?.map((video) => {
          const progress = progressMap[video._id];

          let status = "not-started";
          if (progress) {
            status = progress.completed
              ? "completed"
              : "in-progress";
          }

          return (
            <div
              key={video._id}
              className="video-card"
              onClick={async () => {
                try {
                  await updateVideoProgress(
                    playlistId,
                    video._id,
                    1
                  );

                  setProgressMap((prev) => ({
                    ...prev,
                    [video._id]: {
                      ...(prev[video._id] || {}),
                      completed: false,
                      seconds: 1
                    }
                  }));
                } catch {}

                navigate(
                  `/playlist/${playlistId}/${video._id}`
                );
              }}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="video-thumb"
              />

             <div className="video-details">
  <h4 className="video-title">{video.title}</h4>

  <div className="video-meta-row">
    <span className="video-duration">
      {formatDuration(video.duration)}
    </span>

    {status === "completed" && (
      <span className="status-badge completed">
        Completed
      </span>
    )}

    {status === "in-progress" && (
      <span className="status-badge in-progress">
        In Progress
      </span>
    )}
  </div>

  <div className="video-actions">
    <button
      className="complete-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleMarkCompleted(video._id);
      }}
    >
      {status === "completed"
        ? "Mark In Progress"
        : "Mark Complete"}
    </button>

    <button
      className="delete-video-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(video._id);
      }}
    >
      Delete
    </button>
  </div>
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 