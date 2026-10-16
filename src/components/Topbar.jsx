import React from "react";
import { Menu, Bell, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
export default function Topbar({ title, subtitle, onMenu }) {
  const { user, logout } = useAuth();
  return <header className="topbar"><button className="mobile-menu icon-button" onClick={onMenu} aria-label="Open menu"><Menu size={20}/></button><div className="topbar-title"><h1>{title}</h1><p>{subtitle}</p></div><div className="topbar-right"><span className="api-live"><i/> API session</span><button className="icon-button notification" title="Notifications"><Bell size={18}/></button><div className="topbar-user"><div className="avatar">{(user?.full_name || "OG").slice(0,2).toUpperCase()}</div><div><strong>{user?.full_name || "User"}</strong><span>{user?.email || ""}</span></div></div><button className="logout-button" onClick={logout}><LogOut size={16}/><span>Logout</span></button></div></header>;
}
