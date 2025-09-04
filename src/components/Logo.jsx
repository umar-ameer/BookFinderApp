import React from "react";

/**
 * Logo (no subtitle). Size is adjustable.
 * Usage: <Logo size={48} />
 */
export default function Logo({ size = 44 }) {
  return (
    <div className="brand" style={{ "--brand-size": `${size}px` }}>
      <svg className="brand-mark" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="bfGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* left page */}
        <path d="M6 9c0-2 1.6-3 3.6-3H22v30H9.6C7.6 36 6 37 6 39V9z" fill="url(#bfGrad)" />
        {/* right page */}
        <path d="M42 9c0-2-1.6-3-3.6-3H26v30h12.4c2 0 3.6 1 3.6 3V9z" fill="#1f2a44" />
        {/* curves */}
        <path
          d="M22 6c-6 0-9 2-12 2v26c3-1 6-2 12-2m4-26c6 0 9 2 12 2v26c-3-1-6-2-12-2"
          stroke="#9aa4b2" strokeWidth="1.5" fill="none"
        />
        {/* bookmark */}
        <path d="M30 10h6v12l-3-2-3 2V10z" fill="url(#bfGrad)" />
      </svg>

      <div className="brand-text">
        <span className="brand-word">Book Finder</span>
        {/* subtitle removed */}
      </div>
    </div>
  );
}