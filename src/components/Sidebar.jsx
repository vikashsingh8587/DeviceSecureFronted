import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Smartphone, MapPinned, ShieldAlert, Terminal, Settings, LogOut, ChevronLeft } from "lucide-react";
import Brand from "./Brand";
import { useAuth } from "../auth/AuthContext";

const links = [
  ["/", "Overview", LayoutDashboard], ["/devices", "My devices", Smartphone],
  ["/locations", "Locations", MapPinned], ["/security", "Security events", ShieldAlert],
  ["/commands", "Device commands", Terminal], ["/settings", "Settings", Settings]
];
export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  return <>
    {open && <button className="scrim" onClick={onClose} aria-label="Close menu"/>}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand"><Brand/><button className="close-sidebar" onClick={onClose}><ChevronLeft size={18}/></button></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{links.map(([to,label,Icon]) => <NavLink key={to} to={to} end={to==="/"} onClick={onClose} className={({isActive})=>`nav-link ${isActive?"active":""}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><ShieldCheckSmall/><div><strong>Account protected</strong><p>Manage only devices registered to your account.</p></div></div>
        <div className="profile-row"><div className="avatar">{(user?.full_name || "OG").slice(0,2).toUpperCase()}</div><div className="profile-text"><strong>{user?.full_name || "OmniGuard User"}</strong><span>{user?.email || "Personal workspace"}</span></div><button className="logout-mini" title="Logout" onClick={logout}><LogOut size={16}/></button></div>
      </div>
    </aside>
  </>;
}
function ShieldCheckSmall(){return <span className="note-shield">✓</span>}
