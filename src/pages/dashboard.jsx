import React, { useEffect, useState } from "react";
import {
  fetchMyPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getSavedPlaylists,
  removeSavedPlaylist,
} from "../api/playlist.js";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "./StarRating.jsx";

const TABS = ["My Playlists", "Saved"];

/* ════════════════════════════════════════════════
   USER MENU
   ════════════════════════════════════════════════ */
function UserMenu({ username }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="db-user-menu" onBlur={() => setOpen(false)} tabIndex={0}>
      <button className="db-user-avatar" onClick={() => setOpen((v) => !v)}>
        {(username || "U")[0].toUpperCase()}
      </button>
      {open && (
        <div className="db-user-dropdown">
          <span className="db-user-name">👤 {username}</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   FORM PANEL
   ════════════════════════════════════════════════ */
function FormPanel({ title, form, setForm, onSubmit, onClose, submitLabel }) {
  return (
    <div className="db-form slide-up">
      <div className="db-form-header">
        <h2>{title}</h2>
        <button className="db-form-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      <input
        placeholder="Playlist title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      <textarea
        placeholder="What's this playlist about?"
        rows={3}
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      />
      <div className="db-vis-toggle">
        <button
          className={`db-vis-btn ${form.isPublic ? "active" : ""}`}
          onClick={() => setForm((f) => ({ ...f, isPublic: true }))}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
            <path d="M2 12h20"/>
          </svg>
          Public
        </button>
        <button
          className={`db-vis-btn ${!form.isPublic ? "active" : ""}`}
          onClick={() => setForm((f) => ({ ...f, isPublic: false }))}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="11" x="3" y="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Private
        </button>
      </div>
      <button className="db-submit-btn" onClick={onSubmit}>{submitLabel}</button>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PLAYLIST CARD
   ════════════════════════════════════════════════ */
function PlaylistCard({ playlist, index, isSaved, onEdit, onDelete, onUnsave, onNavigate }) {
  return (
    <div
      className="db-card fade-in"
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={() => onNavigate(playlist._id)}
    >
      <div className="db-card-thumb">
        <img
          src={playlist.videos?.[0]?.thumbnailUrl || ""}
          alt={playlist.title}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {!playlist.videos?.[0]?.thumbnailUrl && (
          <div className="db-card-thumb-empty">🎬</div>
        )}
        <div className="db-card-count">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            <path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
          </svg>
          {playlist.totalVideos || 0}
        </div>
        {isSaved ? (
          <div className="db-card-saved-chip">Saved</div>
        ) : (
          <span className={`db-card-vis ${playlist.isPublic ? "public" : "private"}`}>
            {playlist.isPublic ? "Public" : "Private"}
          </span>
        )}
      </div>

      <div className="db-card-body">
        <h3 className="db-card-title">{playlist.title}</h3>
        <p className="db-card-desc">{playlist.description}</p>

        {isSaved && playlist.creator && (
          <div className="db-card-creator">
            <div className="db-card-avatar">
              {(playlist.creator.username || "U")[0].toUpperCase()}
            </div>
            <span>{playlist.creator.username}</span>
          </div>
        )}

        <div className="db-card-stats">
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {(playlist.views || 0).toLocaleString()}
          </span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <StarRating
            playlistId={playlist._id}
            averageRating={playlist.averageRating}
            ratingsCount={playlist.ratingsCount}
            size="sm"
          />
        </div>

        <div className="db-card-actions" onClick={(e) => e.stopPropagation()}>
          {isSaved ? (
            <button className="db-delete-btn db-unsave-btn" onClick={() => onUnsave(playlist._id)}>
              Remove from Saved
            </button>
          ) : (
            <>
              <button className="db-edit-btn"   onClick={() => onEdit(playlist)}>Edit</button>
              <button className="db-delete-btn" onClick={() => onDelete(playlist._id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SKELETON
   ════════════════════════════════════════════════ */
function Skeleton({ i }) {
  return (
    <div className="db-skeleton" style={{ animationDelay: `${i * 60}ms` }}>
      <div className="sk-thumb" />
      <div className="sk-body">
        <div className="sk-line sk-title" />
        <div className="sk-line sk-desc"  />
        <div className="sk-line sk-short" />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════ */
export default function Dashboard() {
  const [playlists,    setPlaylists]    = useState([]);
  const [saved,        setSaved]        = useState([]);
  const [activeTab,    setActiveTab]    = useState("My Playlists");
  const [showForm,     setShowForm]     = useState(false);
  const [form,         setForm]         = useState({ title: "", description: "", isPublic: true });
  const [editingId,    setEditingId]    = useState(null);
  const [loadingOwn,   setLoadingOwn]   = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadPlaylists();
    loadSaved();
  }, []);

  const loadPlaylists = async () => {
    setLoadingOwn(true);
    try {
      const res = await fetchMyPlaylists();
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      console.error(err);
      setPlaylists([]);
    } finally {
      setLoadingOwn(false);
    }
  };

  const loadSaved = async () => {
    setLoadingSaved(true);
    try {
      const res = await getSavedPlaylists();
      setSaved(res.data || []);
    } catch (err) {
      console.error(err);
      setSaved([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/login"); }
    catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    if (!form.title || !form.description) { alert("Title and description required"); return; }
    try {
      const res = await createPlaylist(form);
      const newPlaylist = { ...res.data, videos: res.data.videos || [] };
      setPlaylists((prev) => [newPlaylist, ...prev]);
      setForm({ title: "", description: "", isPublic: true });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await updatePlaylist(id, form);
      setPlaylists((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      setEditingId(null);
      setForm({ title: "", description: "", isPublic: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsave = async (id) => {
    try {
      await removeSavedPlaylist(id);
      setSaved((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (playlist) => {
    setEditingId(playlist._id);
    setShowForm(false);
    setForm({ title: playlist.title, description: playlist.description, isPublic: playlist.isPublic });
  };

  const myTotal    = playlists.length;
  const totalViews = playlists.reduce((a, p) => a + (p.views || 0), 0);

  return (
    <div className="db-root">
      {/* ── Top Nav ── */}
      <header className="db-nav">
        <div className="db-nav-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            <path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
          </svg>
          <span>PlaylistHub</span>
        </div>
        <div className="db-nav-actions">
          <button className="db-nav-btn" onClick={() => navigate("/explore")}>Explore</button>
          <button
            className="db-nav-create"
            onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            New Playlist
          </button>
          <UserMenu username={user?.username} />
          <button className="db-nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="db-main">

        {/* ── Page Title ── */}
        <div className="db-page-head fade-in">
          <h1>My <span className="db-accent-text">Dashboard</span></h1>
          <p>Manage your playlists and track your learning</p>
        </div>

        {/* ── Stats ── */}
        <div className="db-stats fade-in" style={{ animationDelay: "80ms" }}>
          <div className="db-stat">
            <span className="db-stat-value">{myTotal}</span>
            <span className="db-stat-label">Playlists</span>
          </div>
          <div className="db-stat-divider" />
          <div className="db-stat">
            <span className="db-stat-value">{saved.length ?? "—"}</span>
            <span className="db-stat-label">Saved</span>
          </div>
          <div className="db-stat-divider" />
          <div className="db-stat">
            <span className="db-stat-value">{totalViews.toLocaleString()}</span>
            <span className="db-stat-label">Total Views</span>
          </div>
          <div className="db-stat-divider" />
          <div className="db-stat">
            <span className="db-stat-value">—</span>
            <span className="db-stat-label">Streak</span>
          </div>
        </div>

        {/* ── Create / Edit Form ── */}
        {showForm && (
          <FormPanel
            title="New Playlist"
            form={form}
            setForm={setForm}
            onSubmit={handleCreate}
            onClose={() => setShowForm(false)}
            submitLabel="Create Playlist"
          />
        )}
        {editingId && (
          <FormPanel
            title="Edit Playlist"
            form={form}
            setForm={setForm}
            onSubmit={() => handleUpdate(editingId)}
            onClose={() => {
              setEditingId(null);
              setForm({ title: "", description: "", isPublic: true });
            }}
            submitLabel="Save Changes"
          />
        )}

        {/* ── Tabs ── */}
        <div className="db-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`db-tab ${activeTab === t ? "db-tab--active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
              <span className="db-tab-count">
                {t === "My Playlists" ? myTotal : saved.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── My Playlists ── */}
        {activeTab === "My Playlists" && (
          loadingOwn ? (
            <div className="db-grid">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} i={i} />)}
            </div>
          ) : playlists.length === 0 ? (
            <div className="db-empty fade-in">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                <path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
              </svg>
              <h3>No playlists yet</h3>
              <p>Hit "New Playlist" to get started.</p>
            </div>
          ) : (
            <div className="db-grid">
              {playlists.map((p, i) => (
                <PlaylistCard
                  key={p._id}
                  playlist={p}
                  index={i}
                  isSaved={false}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onNavigate={(id) => navigate(`/playlist/${id}`)}
                />
              ))}
            </div>
          )
        )}

        {/* ── Saved Playlists ── */}
        {activeTab === "Saved" && (
          loadingSaved ? (
            <div className="db-grid">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} i={i} />)}
            </div>
          ) : saved.length === 0 ? (
            <div className="db-empty fade-in">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <h3>No saved playlists</h3>
              <p>Browse Explore and save playlists you like.</p>
              <button className="db-submit-btn db-empty-cta" onClick={() => navigate("/explore")}>
                Go to Explore
              </button>
            </div>
          ) : (
            <div className="db-grid">
              {saved.map((p, i) => (
                <PlaylistCard
                  key={p._id}
                  playlist={p}
                  index={i}
                  isSaved
                  onUnsave={handleUnsave}
                  onNavigate={(id) => navigate(`/playlist/${id}`)}
                />
              ))}
            </div>
          )
        )}

      </main>
    </div>
  );
}