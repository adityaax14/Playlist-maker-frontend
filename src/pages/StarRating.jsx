import React, { useState } from "react";
import { ratePlaylist, deleteRating } from "../api/playlist";
import "../styles/StarRating.css";

/**
 * Interactive star rating widget.
 * - Hover to preview, click to submit
 * - Click your own active rating again → removes it
 * Props:
 *   playlistId      string
 *   averageRating   number   (from playlist doc)
 *   ratingsCount    number
 *   size            "sm" | "md"  (default "md")
 */
export default function StarRating({
  playlistId,
  averageRating = 0,
  ratingsCount  = 0,
  size = "md",
}) {
  const [hovered,    setHovered]    = useState(0);   // star index being hovered (1-5)
  const [userRating, setUserRating] = useState(0);   // user's submitted rating
  const [avg,        setAvg]        = useState(Number(averageRating));
  const [count,      setCount]      = useState(Number(ratingsCount));
  const [loading,    setLoading]    = useState(false);

  const display = hovered || userRating || avg; // what to visually fill up to

  const handleClick = async (star) => {
    if (loading) return;
    setLoading(true);
    try {
      if (userRating === star) {
        // toggle off — remove rating
        await deleteRating(playlistId);
        setUserRating(0);
        // optimistic: recalculate avg without this rating
        const newCount = Math.max(count - 1, 0);
        const newAvg   = newCount === 0 ? 0 : ((avg * count - star) / newCount);
        setCount(newCount);
        setAvg(Math.round(newAvg * 10) / 10);
      } else {
        await ratePlaylist(playlistId, star);
        // optimistic update
        const oldContrib = userRating > 0 ? avg * count - userRating : avg * count;
        const newCount   = userRating > 0 ? count : count + 1;
        const newAvg     = (oldContrib + star) / newCount;
        setUserRating(star);
        setCount(newCount);
        setAvg(Math.round(newAvg * 10) / 10);
      }
    } catch (err) {
      console.error("Rating failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`sr-root sr-${size}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="sr-stars"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(display);
          const isOwn  = star <= userRating;
          return (
            <button
              key={star}
              className={`sr-star ${filled ? "sr-filled" : ""} ${isOwn ? "sr-own" : ""} ${loading ? "sr-loading" : ""}`}
              onMouseEnter={() => setHovered(star)}
              onClick={() => handleClick(star)}
              aria-label={`Rate ${star} stars`}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          );
        })}
      </div>

      <div className="sr-meta">
        <span className="sr-avg">{avg > 0 ? avg.toFixed(1) : "—"}</span>
        <span className="sr-count">({count})</span>
      </div>
    </div>
  );
}
