import React, { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import {
  fetchMyPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} from "../api/playlist";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
  const [playlists, setPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", isPublic: true });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { loadPlaylists(); }, []);

  const loadPlaylists = async () => {
    try {
      const res = await fetchMyPlaylists();
      setPlaylists(res.data.playlists || []);
    } catch (err) { console.error("Failed to load playlists", err); setPlaylists([]); }
  };

  const handleCreate = async () => {
    try {
      if (!form.title || !form.description) { alert("Title and description required"); return; }
      const res = await createPlaylist(form);
      setPlaylists((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "", isPublic: true });
      setShowForm(false);
    } catch (err) { console.error("Create failed", err); alert("Failed to create playlist"); }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await updatePlaylist(id, form);
      setPlaylists((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      setEditingId(null);
    } catch (err) { console.error("Update failed", err); }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch (err) { console.error("Delete failed", err); }
  };

  return (
    
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header fade-in">
          <div className="header-left">
            <div className="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
              </svg>
            </div>
            <h1>My <span className="gradient-text">Playlists</span></h1>
          </div>
          <button
      className="explore-btn"
      onClick={() => navigate("/explore")}
    >
      Explore
    </button>
          <button className="gradient-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Create Playlist
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card fade-in" style={{ animationDelay: "100ms" }}>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
              </svg>
            </div>
            <div>
              <h3>{playlists.length}</h3>
              <p>Total Playlists</p>
            </div>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: "200ms" }}>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/><path d="M13 17V9"/><path d="M18 17V5"/><path d="M8 17v-3"/>
              </svg>
            </div>
            <div>
              <h3>Coming soon</h3>
              <p>Your Progress</p>
            </div>
          </div>
          <div className="stat-card fade-in" style={{ animationDelay: "300ms" }}>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <h3>Coming soon</h3>
              <p>Learning Streak</p>
            </div>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="playlist-form slide-up">
            <div className="form-header">
              <h2>New Playlist</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <input placeholder="Playlist title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="What's this playlist about?" value={form.description} rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="visibility-toggle">
              <button className={`vis-btn ${form.isPublic ? "active" : ""}`} onClick={() => setForm({ ...form, isPublic: true })}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                </svg>
                Public
              </button>
              <button className={`vis-btn ${!form.isPublic ? "active" : ""}`} onClick={() => setForm({ ...form, isPublic: false })}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Private
              </button>
            </div>
            <button className="gradient-btn submit-btn" onClick={handleCreate}>Save Playlist</button>
          </div>
        )}

        {/* Edit Form */}
        {editingId && (
          <div className="playlist-form slide-up">
            <div className="form-header">
              <h2>Edit Playlist</h2>
              <button className="close-btn" onClick={() => setEditingId(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <input placeholder="Playlist title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="What's this playlist about?" value={form.description} rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="visibility-toggle">
              <button className={`vis-btn ${form.isPublic ? "active" : ""}`} onClick={() => setForm({ ...form, isPublic: true })}>Public</button>
              <button className={`vis-btn ${!form.isPublic ? "active" : ""}`} onClick={() => setForm({ ...form, isPublic: false })}>Private</button>
            </div>
            <button className="gradient-btn submit-btn" onClick={() => handleUpdate(editingId)}>Update Playlist</button>
          </div>
        )}

        {/* Playlist Grid */}
        {playlists.length === 0 ? (
          <div className="empty-state fade-in" style={{ animationDelay: "200ms" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
              <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
            </svg>
            <h3>No playlists yet</h3>
            <p>Create your first playlist to get started.</p>
          </div>
        ) : (
          <div className="playlist-grid">
  {playlists.map((playlist, i) => (
    <div
      key={playlist._id}
      className="playlist-card fade-in"
      style={{ animationDelay: `${100 + i * 80}ms` }}
      onClick={() => navigate(`/playlist/${playlist._id}`)}
    >
        <div className="playlist-cover">
    <img
      src={
        playlist.videos?.[0]?.thumbnailUrl ||
        "https://via.placeholder.com/600x340?text=No+Videos"
      }
      alt={playlist.title}
    />
  </div>
                <div className="card-top">
                  <div className="card-title-row">
                    <h3>{playlist.title}</h3>
                    <span className={`badge ${playlist.isPublic ? "badge-public" : "badge-private"}`}>
                      {playlist.isPublic ? "🌐 Public" : "🔒 Private"}
                    </span>
                  </div>
                  <p className="card-desc">{playlist.description}</p>
                </div>
                <div className="card-bottom">
                  <div className="playlist-meta">
                    <span>🎬 {playlist.totalVideos || 0} videos</span>
                    <span>👁 {playlist.views || 0} views</span>
                  </div>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={(e) => {  e.stopPropagation(); setEditingId(playlist._id); setShowForm(false); setForm({ title: playlist.title, description: playlist.description, isPublic: playlist.isPublic }); }}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={(e) =>{ e.stopPropagation();  handleDelete(playlist._id)}}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
}
