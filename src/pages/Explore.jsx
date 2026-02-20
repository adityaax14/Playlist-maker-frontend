import React from "react";
import { useEffect, useState } from "react";
import {
  getTrendingPlaylists,
  getTopRatedPlaylists,
  getNewestPlaylists,
  explorePlaylists
} from "../api/playlist";
import "../styles/explore.css";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newest, setNewest] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  
  const navigate=useNavigate();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const [t, r, n] = await Promise.all([
        getTrendingPlaylists(),
        getTopRatedPlaylists(),
        getNewestPlaylists()
      ]);

      setTrending(t.data);
      setTopRated(r.data);
      setNewest(n.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const trimmed = search.trim();

    let urlParams = "";
    if (trimmed !== "") {
      urlParams = `search=${encodeURIComponent(trimmed)}`;
    }
    const res = await explorePlaylists(urlParams);
    setResults(res.data.playlists);
    } catch (err) {
      console.error(err);
    }
  };

  const renderCards = (list) =>
    list.map((p) => (
      <div key={p._id} className="explore-card" onClick={() => navigate(`/playlist/${p._id}`)}>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="meta">
          <span>👤 {p.creator?.username}</span>
          <span>🎬 {p.totalVideos || 0}</span>
          <span>👁 {p.views || 0}</span>
        </div>
        
      </div>
    ));

  return (
    
  <div className="explore-container">
    <div className="explore-content">
      
      {/* Header */}
      <div className="explore-header">
        <h1>
          Explore <span>Playlists</span>
        </h1>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <section>
          <h2>Search Results</h2>
          <div className="explore-grid">
            {renderCards(results)}
          </div>
        </section>
      )}

      {/* Trending */}
      <section>
        <h2>Trending</h2>
        <div className="explore-grid">
          {renderCards(trending)}
        </div>
      </section>

      {/* Top Rated */}
      <section>
        <h2>Top Rated</h2>
        <div className="explore-grid">
          {renderCards(topRated)}
        </div>
      </section>

      {/* Newest */}
      <section>
        <h2>Newest</h2>
        <div className="explore-grid">
          {renderCards(newest)}
        </div>
      </section>

    </div>
  </div>
);
  
}