import React from "react";
import Logo from "./Logo.jsx";

export default function Header({activeTab, setActiveTab}){
  return (
    <header className="app-header">
      <div className="header-inner container">
        <Logo size={48} />
        <nav className="tabs" role="tablist" aria-label="Primary">
          <button
            className={"tab " + (activeTab==="search" ? "active" : "")}
            aria-selected={activeTab==="search"} role="tab"
            onClick={()=>setActiveTab("search")}
          >
            Home
          </button>
          <button
            className={"tab " + (activeTab==="favorites" ? "active" : "")}
            aria-selected={activeTab==="favorites"} role="tab"
            onClick={()=>setActiveTab("favorites")}
          >
            Favorites
          </button>
          {/* Removed the Open Library API link */}
        </nav>
      </div>
    </header>
  );
}