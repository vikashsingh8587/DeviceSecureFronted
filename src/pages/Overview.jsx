import React, { useEffect, useState } from "react";
import { Activity, Smartphone, Wifi, ShieldCheck, RefreshCw, MapPin, BatteryCharging, ArrowUpRight, Clock3 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { PageHeader, Panel, Loading, Empty } from "../components/Ui";
import StatusPill from "../components/StatusPill";

export default function Overview() {
  const { user } = useAuth();
  const [devices,setDevices]=useState([]);
  const [statuses,setStatuses]=useState({});
  const [locations,setLocations]=useState({});
  const [events,setEvents]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  async function load(){
    setLoading(true);setError("");
    try{
      const ds=await api.devices(); const list=Array.isArray(ds)?ds:[];
      setDevices(list);
      const results=await Promise.all(list.map(async d=>{
        const [status,location,eventResult]=await Promise.allSettled([api.deviceStatus(d.id),api.latestLocation(d.id),api.securityEvents(d.id,5,0)]);
        return {id:d.id,status:status.status==="fulfilled"?status.value:null,location:location.status==="fulfilled"?location.value:null,events:eventResult.status==="fulfilled"?(eventResult.value.items||[]):[]};
      }));
      const sm={},lm={},ev=[];
      results.forEach(r=>{if(r.status)sm[r.id]=r.status;if(r.location)lm[r.id]=r.location;ev.push(...r.events.map(e=>({...e,device_name:list.find(d=>d.id===r.id)?.device_name})));});
      setStatuses(sm);setLocations(lm);setEvents(ev.sort((a,b)=>new Date(b.occurred_at)-new Date(a.occurred_at)).slice(0,5));
    }catch(e){setError(e.message);}finally{setLoading(false);}
  }
  useEffect(()=>{load();},[]);
  const online=Object.values(statuses).filter(s=>s.is_online).length;
  const batteryValues=Object.values(statuses).map(s=>s.battery_level).filter(v=>v!==null&&v!==undefined);
  const avgBattery=batteryValues.length?Math.round(batteryValues.reduce((a,b)=>a+Number(b),0)/batteryValues.length):null;
  const chartData=[{day:"Mon",value:2},{day:"Tue",value:4},{day:"Wed",value:3},{day:"Thu",value:6},{day:"Fri",value:5},{day:"Sat",value:8},{day:"Sun",value:7}];
  return <div className="page-stack"><div className="welcome-banner"><div className="welcome-copy"><div className="eyebrow"><span className="pulse"/> YOUR SECURITY AT A GLANCE</div><h2>Welcome back, {user?.full_name?.split(" ")[0]||"there"}.</h2><p>Monitor your registered devices from one secure workspace.</p><div className="welcome-meta"><span><ShieldCheck size={14}/> Account-scoped device access</span><span><Clock3 size={14}/> Live data from your API</span></div></div><div className="welcome-art"><div className="orbit"/><div className="shield-art"><ShieldCheck size={53}/></div><div className="art-chip">● SECURE SESSION</div></div><button className="banner-refresh" onClick={load} title="Refresh dashboard"><RefreshCw size={17}/></button></div>
    {error&&<div className="notice error">{error}</div>}
    {loading?<Loading label="Loading your account devices..."/>:<><div className="stats-grid"><Stat label="Registered devices" value={devices.length} hint="Owned by your account" icon={Smartphone} tone="blue"/><Stat label="Reported online" value={`${online} / ${devices.length}`} hint="From device status reports" icon={Wifi} tone="green"/><Stat label="Battery reports" value={avgBattery===null?"—":`${avgBattery}%`} hint="Average reported battery" icon={BatteryCharging} tone="purple"/><Stat label="Security events" value={events.length} hint="Latest fetched events" icon={Activity} tone="amber"/></div>
    <div className="content-grid"><Panel className="padded"><div className="panel-heading"><div><h3>Registered devices</h3><p>Devices linked to your OmniGuard account</p></div><a className="text-link" href="/devices">Manage devices <ArrowUpRight size={14}/></a></div>{devices.length?<div className="device-list">{devices.slice(0,5).map(d=><div className="device-row" key={d.id}><div className="device-icon"><Smartphone size={19}/></div><div className="device-copy"><strong>{d.device_name}</strong><span>{d.platform} · {d.model||"Model not reported"}</span></div><div className="device-right"><StatusPill status={statuses[d.id]?.is_online?"Online":statuses[d.id]?"Offline":d.status||"Unknown"}/><span className="muted small">{statuses[d.id]?.battery_level!=null?`${statuses[d.id].battery_level}% battery`:"No telemetry"}</span></div></div>)}</div>:<Empty title="No devices registered" description="Register your phone or laptop to begin monitoring its status."/>}</Panel>
    <Panel className="padded"><div className="panel-heading"><div><h3>Latest location reports</h3><p>Last known locations from your devices</p></div><MapPin size={18} className="blue-text"/></div>{Object.keys(locations).length?<div className="location-mini-list">{Object.entries(locations).map(([id,l])=><div className="location-mini" key={id}><div className="location-dot"><MapPin size={16}/></div><div><strong>{devices.find(d=>String(d.id)===String(id))?.device_name||`Device ${id}`}</strong><span>{Number(l.latitude).toFixed(5)}, {Number(l.longitude).toFixed(5)}</span><small>{l.recorded_at?new Date(l.recorded_at).toLocaleString():"Timestamp unavailable"}</small></div><a href={`https://www.openstreetmap.org/?mlat=${l.latitude}&mlon=${l.longitude}#map=16/${l.latitude}/${l.longitude}`} target="_blank" rel="noreferrer">Map ↗</a></div>)}</div>:<Empty title="No location reports yet" description="Location reports appear after your registered device sends GPS data."/>}</Panel></div>
    <div className="content-grid"><Panel className="padded"><div className="panel-heading"><div><h3>Activity overview</h3><p>Illustrative visual until event analytics are added to the API</p></div><Activity size={18} className="blue-text"/></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5795ff" stopOpacity={.28}/><stop offset="100%" stopColor="#5795ff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#24334a" vertical={false} strokeDasharray="3 5"/><XAxis dataKey="day" tick={{fill:"#8293ae",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#8293ae",fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#111b2b",border:"1px solid #2b3b54",borderRadius:8}}/><Area dataKey="value" type="monotone" stroke="#5795ff" fill="url(#activityFill)" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div></Panel><Panel className="padded"><div className="panel-heading"><div><h3>Recent security events</h3><p>Events reported for your devices</p></div><a className="text-link" href="/security">View all <ArrowUpRight size={14}/></a></div>{events.length?<div className="event-list">{events.map(e=><div className="event-row" key={e.id}><div className={`event-symbol ${e.severity}`}>!</div><div><strong>{e.event_type}</strong><p>{e.description||"No additional details provided."}</p><small>{e.device_name||`Device ${e.device_id}`} · {e.occurred_at?new Date(e.occurred_at).toLocaleString():"Recently"}</small></div></div>)}</div>:<Empty title="No security events" description="New events reported by your devices will appear here."/>}</Panel></div></>}
  </div>;
}
function Stat({label,value,hint,icon:Icon,tone}){return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={19}/></div></div><div className="stat-value">{value}</div><div className="stat-foot">{hint}</div></div>}
