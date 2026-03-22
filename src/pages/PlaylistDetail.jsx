import React, { useEffect, useState, useRef } from "react";
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

  const [playlist,         setPlaylist]         = useState(null);
  const [videoInput,       setVideoInput]        = useState("");
  const [activeVideo,      setActiveVideo]       = useState(null);
  const [note,             setNote]              = useState("");
  const [player,           setPlayer]            = useState(null);
  const [savedTime,        setSavedTime]         = useState(0);
  const [hasSeeked,        setHasSeeked]         = useState(false);
  const [playlistProgress, setPlaylistProgress]  = useState(0);
  const [progressMap,      setProgressMap]       = useState({});
  const [lastVideoId,      setLastVideoId]       = useState(null);
  const [goalData,         setGoalData]          = useState(null);
  const [streak,           setStreak]            = useState(0);
  const [chartData,        setChartData]         = useState([]);
  const [showAnalytics,    setShowAnalytics]     = useState(false);
  const [showGoalModal,    setShowGoalModal]     = useState(false);
  const [goalType,         setGoalType]          = useState("days");
  const [targetDays,       setTargetDays]        = useState("");
  const [dailyMinutes,     setDailyMinutes]      = useState("");
  const [targetDate,       setTargetDate]        = useState("");

  const playerRef = useRef(null);

  /* ── Load Playlist ── */
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

  /* ── Navigation ── */
  const currentIndex = playlist?.videos?.findIndex(
    (v) => v._id === activeVideo?._id
  );

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = playlist.videos[currentIndex - 1];
      navigate(`/playlist/${playlistId}/${prev._id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < playlist.videos.length - 1) {
      const next = playlist.videos[currentIndex + 1];
      navigate(`/playlist/${playlistId}/${next._id}`);
    }
  };

  const scrollToPlayer = () => {
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Add Video ── */
  const handleAddVideo = async () => {
    if (!videoInput) return;
    try {
      const url = new URL(videoInput);
      const videoIdParam    = url.searchParams.get("v");
      const playlistIdParam = url.searchParams.get("list");

      if (playlistIdParam) {
        await importYoutubePlaylist(playlistId, playlistIdParam);
      } else if (videoIdParam) {
        await addVideoToPlaylist(playlistId, { youtubeVideoId: videoIdParam });
      }
      window.location.reload();
    } catch {
      alert("Invalid YouTube link");
    }
  };

  const handleDeleteVideo = async (vid) => {
    await deleteVideoFromPlaylist(playlistId, vid);
    window.location.reload();
  };

  /* ── Load Note — fires every time videoId changes ── */
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
  }, [playlistId, videoId]); // ← videoId from URL, updates on navigate

  const handleSaveNote = async () => {
    if (!videoId) return;
    await saveVideoNote(playlistId, videoId, note);
    alert("Note saved");
  };

  /* ── Load Single Video Progress ── */
  useEffect(() => {
    if (!activeVideo) return;
    const load = async () => {
      try {
        const res = await getVideoProgress(playlistId, activeVideo._id);
        setSavedTime(res.data?.watchedSeconds || 0);
      } catch {
        setSavedTime(0);
      }
    };
    load();
  }, [activeVideo, playlistId]);

  /* ── Load Playlist Progress ── */
  useEffect(() => {
    const load = async () => {
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
    load();
  }, [playlistId, activeVideo]);

  /* ── Mark Completed ── */
  const handleMarkCompleted = async (vid) => {
    try {
      const res = await markVideoCompleted(playlistId, vid);
      const completed = res.data.completed;

      const updatedMap = {
        ...progressMap,
        [vid]: {
          ...(progressMap[vid] || {}),
          completed,
          seconds: completed ? 9999 : 1
        }
      };
      setProgressMap(updatedMap);

      const total          = playlist.videos.length;
      const completedCount = Object.values(updatedMap).filter((p) => p.completed).length;
      setPlaylistProgress(Math.round((completedCount / total) * 100));

      if (showAnalytics) await loadAnalytics();
    } catch (err) {
      console.error("Complete toggle failed", err);
    }
  };

  /* ── Reset seek on video change ── */
  useEffect(() => { setHasSeeked(false); }, [activeVideo]);

  /* ── Progress sync interval ── */
  useEffect(() => {
    if (!player || !activeVideo) return;
    let lastSent = 0;
    const interval = setInterval(async () => {
      try {
        const state = player.getPlayerState();
        if (state !== 1) return;
        const currentTime = Math.floor(player.getCurrentTime());
        if (currentTime > lastSent + 5) {
          lastSent = currentTime;
          await updateVideoProgress(playlistId, activeVideo._id, currentTime);
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [player, activeVideo, playlistId]);

  /* ── Helpers ── */
  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  /* ── Analytics ── */
  const loadAnalytics = async () => {
    try {
      const goalRes   = await getGoalStatus(playlistId);
      const streakRes = await getStreak(playlistId);
      const chartRes  = await getProgressChart(playlistId);
      setGoalData(goalRes.data);
      setStreak(streakRes.streak || 0);
      setChartData(chartRes);
    } catch (err) {
      console.error("Analytics load failed", err);
    }
  };

  /* ── Set Goal ── */
  const handleSetGoal = async () => {
    try {
      let payload = { goalType };
      if      (goalType === "days")          payload.targetDays          = Number(targetDays);
      else if (goalType === "daily_minutes") payload.dailyTargetMinutes  = Number(dailyMinutes);
      else if (goalType === "target_date")   payload.targetDate          = targetDate;

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

      {/* ── Header ── */}
      <div className="playlist-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Playlists
        </button>

        <div className="streak-badge">🔥 {streak} Day Streak</div>

        {lastVideoId && (
          <button
            className="continue-btn"
            onClick={() => navigate(`/playlist/${playlistId}/${lastVideoId}`)}
          >
            ▶ Continue Watching
          </button>
        )}

        <h1 className="playlist-title-glow">{playlist.title}</h1>

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

      {/* ── Goal Buttons ── */}
      <div className="goal-buttons">
        <button className="set-goal-btn" onClick={() => setShowGoalModal(true)}>
           Set Goal
        </button>
        <button
          className="track-goal-btn"
          onClick={() => {
            setShowAnalytics(!showAnalytics);
            if (!showAnalytics) loadAnalytics();
          }}
        >
           Track Goal
        </button>
      </div>

      {/* ── Analytics Panel ── */}
      {showAnalytics && goalData && (
        <>
          <div className="insight-bar">
            <span className={`status-badge ${goalData.status}`}>
              {goalData.status === "ahead"    && "🔥 Ahead"}
              {goalData.status === "on_track" && "👍 On Track"}
              {goalData.status === "behind"   && "⚠️ Behind"}
            </span>
            <span className="projection-text">{goalData.projectedMessage}</span>
          </div>

          <div className="analytics-container">
            <div className="analytics-card today-card">
              <h3>Today</h3>
              <div className="today-main">
                <span className="today-actual">{goalData.todayActualMinutes}</span>
                <span className="today-divider">/</span>
                <span className="today-target">{goalData.todayTargetMinutes} min</span>
              </div>
              <div className={goalData.todayDiffMinutes >= 0 ? "diff positive" : "diff negative"}>
                {goalData.todayDiffMinutes >= 0 ? "+" : ""}{goalData.todayDiffMinutes} min
              </div>
            </div>

            <div className="analytics-card">
              <h3>Your Pace</h3>
              <p>{goalData.yourPaceMinutes} min/day</p>
            </div>

            <div className="analytics-card">
              <h3>Total Backlog</h3>
              <p className={
                goalData.backlogMinutes > 0 ? "backlog behind" :
                goalData.backlogMinutes < 0 ? "backlog ahead"  : "backlog neutral"
              }>
                {goalData.backlogMinutes > 0 && "+"}{goalData.backlogMinutes} min
              </p>
              <span className="backlog-label">
                {goalData.backlogMinutes > 0  && "behind"}
                {goalData.backlogMinutes < 0  && "ahead"}
                {goalData.backlogMinutes === 0 && "on track"}
              </span>
            </div>

            <div className="analytics-card">
              <h3>Last 7 Days</h3>
              <p>{goalData.burnRateMinutes} min/day</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cumulativeExpectedMinutes" stroke="#8884d8" strokeDasharray="5 5" name="Goal" />
                <Line type="monotone" dataKey="cumulativeActualMinutes"   stroke="#e8e8e8" strokeWidth={3} name="You" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="action-feedback">
            {goalData.todayDiffMinutes < 0 ? (
              <p className="warning">
                ⚠️ Watch {Math.abs(goalData.todayDiffMinutes)} more min today to complete today's goal.
              </p>
            ) : (
              <p className="success">✅ You're ahead today! Keep it up 🚀</p>
            )}
          </div>
        </>
      )}

      {/* ── Add Video ── */}
      <div className="add-video-box">
        <input
          type="text"
          placeholder="Paste YouTube video or playlist URL"
          value={videoInput}
          onChange={(e) => setVideoInput(e.target.value)}
        />
        <button onClick={handleAddVideo}>Add</button>
      </div>

      {/* ── Goal Modal ── */}
      {showGoalModal && (
        <div className="goal-modal">
          <div className="goal-modal-content">
            <h2>Set Your Goal</h2>

            {/* FIX 2: "days" option restored */}
            <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
              <option value="days">Finish in X Days</option>
              <option value="daily_minutes">Watch X min/day</option>
              <option value="target_date">Finish by Date</option>
            </select>

            {goalType === "days" && (
              <input
                type="number"
                placeholder="Enter number of days"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
              />
            )}
            {goalType === "daily_minutes" && (
              <input
                type="number"
                placeholder="Minutes per day (e.g. 60)"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(e.target.value)}
              />
            )}
            {goalType === "target_date" && (
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            )}

            <div className="goal-modal-buttons">
              <button onClick={handleSetGoal}>Save Goal</button>
              <button onClick={() => setShowGoalModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Player + Notes ── */}
      <div className="player-layout">
        <div className="video-player" ref={playerRef}>
          {activeVideo && (
            <YouTube
              videoId={activeVideo.youtubeVideoId}
              opts={{ width: "100%", height: "460" }}
              onReady={(e) => setPlayer(e.target)}
              onStateChange={(e) => {
                if (!hasSeeked && savedTime > 0 && (e.data === 1 || e.data === 2 || e.data === 5)) {
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
              disabled={currentIndex >= playlist.videos.length - 1}
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
          <button className="save-note-btn" onClick={handleSaveNote}>
            Save Note
          </button>
        </div>
      </div>

      {/* ── Video List ── */}
      <div className="video-list">
        {playlist.videos?.map((video) => {
          const progress = progressMap[video._id];
          const status   = !progress ? "not-started"
                         : progress.completed ? "completed" : "in-progress";

          return (
            <div
              key={video._id}
              className={`video-card ${activeVideo?._id === video._id ? "video-card--active" : ""}`}
              onClick={async () => {
                try {
                  await updateVideoProgress(playlistId, video._id, 1);
                  setProgressMap((prev) => ({
                    ...prev,
                    [video._id]: { ...(prev[video._id] || {}), completed: false, seconds: 1 }
                  }));
                } catch {}

                setActiveVideo(video);
                // FIX 1: navigate so videoId URL param updates → note useEffect re-fires
                navigate(`/playlist/${playlistId}/${video._id}`);
                scrollToPlayer();
              }}
            >
              <img src={video.thumbnailUrl} alt={video.title} className="video-thumb" />

              <div className="video-details">
                <h4 className="video-title">{video.title}</h4>

                <div className="video-meta-row">
                  <span className="video-duration">{formatDuration(video.duration)}</span>
                  {status === "completed"   && <span className="status-badge completed">Completed</span>}
                  {status === "in-progress" && <span className="status-badge in-progress">In Progress</span>}
                </div>

                <div className="video-actions">
                  <button
                    className="complete-btn"
                    onClick={(e) => { e.stopPropagation(); handleMarkCompleted(video._id); }}
                  >
                    {status === "completed" ? "Mark In Progress" : "Mark Complete"}
                  </button>
                  <button
                    className="delete-video-btn"
                    onClick={(e) => { e.stopPropagation(); handleDeleteVideo(video._id); }}
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