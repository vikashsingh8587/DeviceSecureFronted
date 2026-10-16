import React,{useState} from "react";
import {Navigate,Route,Routes,useLocation} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";
import {useAuth} from "./auth/AuthContext";
import {LoginPage,RegisterPage} from "./pages/AuthPages";
import Overview from "./pages/Overview";
import Devices from "./pages/Devices";
import Locations from "./pages/Locations";
import Security from "./pages/Security";
import Commands from "./pages/Commands";
import Settings from "./pages/Settings";

const meta={"/":["Overview","Your OmniGuard workspace at a glance"],"/devices":["My devices","Manage devices registered to your account"],"/locations":["Device locations","Latest GPS reports and location history"],"/security":["Security events","Review reported security events"],"/commands":["Device commands","Queue and review device requests"],"/settings":["Settings","Account and API configuration"]};
function Shell(){const [open,setOpen]=useState(false);const location=useLocation();const {isAuthenticated}=useAuth();const [title,subtitle]=meta[location.pathname]||meta["/"];return <div className="app-shell"><Sidebar open={open} onClose={()=>setOpen(false)}/><main className="main-area"><Topbar title={title} subtitle={subtitle} onMenu={()=>setOpen(true)}/><div className="page-container"><Routes><Route path="/" element={<Overview/>}/><Route path="/devices" element={<Devices/>}/><Route path="/locations" element={<Locations/>}/><Route path="/security" element={<Security/>}/><Route path="/commands" element={<Commands/>}/><Route path="/settings" element={<Settings/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><footer className="app-footer"><span>© {new Date().getFullYear()} OmniGuard</span><span><i/> Authenticated device security workspace</span></footer></div></main></div>}
export default function App(){const {isAuthenticated}=useAuth();return <Routes><Route path="/login" element={isAuthenticated?<Navigate to="/" replace/>:<LoginPage/>}/><Route path="/register" element={isAuthenticated?<Navigate to="/" replace/>:<RegisterPage/>}/><Route element={<ProtectedRoute/>}><Route path="/*" element={<Shell/>}/></Route></Routes>}
