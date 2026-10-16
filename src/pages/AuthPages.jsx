import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck, LockKeyhole, Fingerprint, Activity } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../auth/AuthContext";

function AuthShell({ mode, children }) {
  return <div className="auth-layout"><section className="auth-visual"><Brand/><div className="auth-visual-copy"><div className="auth-kicker"><span/> OMNIGUARD SECURITY PLATFORM</div><h1>Your devices.<br/><em>Your control.</em></h1><p>One secure place to monitor your registered devices, review locations and keep track of device activity.</p><div className="auth-feature-list"><div><ShieldCheck size={18}/><span>Account-scoped device access</span></div><div><LockKeyhole size={18}/><span>Token-protected API requests</span></div><div><Activity size={18}/><span>Device status and event history</span></div></div></div><div className="auth-visual-footer"><span>OMNIGUARD / DEVICE SECURITY CENTER</span><span>SECURE WORKSPACE</span></div><div className="auth-orb orb-a"/><div className="auth-orb orb-b"/></section><section className="auth-form-side"><div className="auth-mobile-brand"><Brand/></div><div className="auth-form-wrap">{children}<div className="auth-footer">Protected access · OmniGuard API</div></div></section></div>;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [show,setShow] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  async function submit(e){e.preventDefault();setError("");setBusy(true);try{await login(email.trim(),password);navigate(location.state?.from || "/",{replace:true});}catch(err){setError(err.message);}finally{setBusy(false);}}
  return <AuthShell><div className="auth-heading"><div className="auth-icon"><Fingerprint size={23}/></div><div className="auth-eyebrow">WELCOME BACK</div><h2>Sign in to OmniGuard</h2><p>Enter your account details to access your devices.</p></div>{error&&<div className="form-alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label className="field"><span>Email address</span><input type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="field"><span>Password</span><div className="password-wrap"><input type={show?"text":"password"} autoComplete="current-password" placeholder="Enter your password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Hide password":"Show password"}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label><button className="auth-submit" disabled={busy}>{busy?"Signing in...":"Sign in securely"}<ArrowRight size={17}/></button></form><div className="auth-switch">New to OmniGuard? <Link to="/register">Create an account</Link></div><div className="auth-legal">By continuing, you access device information associated with your account.</div></AuthShell>;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [show,setShow] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  async function submit(e){e.preventDefault();setError("");if(password!==confirm){setError("Passwords do not match.");return;}setBusy(true);try{await register(fullName.trim(),email.trim(),password);navigate("/login",{replace:true,state:{registered:true,email:email.trim()}});}catch(err){setError(err.message);}finally{setBusy(false);}}
  return <AuthShell><div className="auth-heading"><div className="auth-icon"><ShieldCheck size={23}/></div><div className="auth-eyebrow">CREATE YOUR WORKSPACE</div><h2>Create an account</h2><p>Register your account before connecting your devices.</p></div>{error&&<div className="form-alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label className="field"><span>Full name</span><input autoComplete="name" placeholder="Your full name" minLength={2} maxLength={100} required value={fullName} onChange={e=>setFullName(e.target.value)}/></label><label className="field"><span>Email address</span><input type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="field"><span>Password</span><div className="password-wrap"><input type={show?"text":"password"} autoComplete="new-password" placeholder="At least 8 characters" minLength={8} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Hide password":"Show password"}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label><label className="field"><span>Confirm password</span><input type="password" autoComplete="new-password" placeholder="Re-enter password" minLength={8} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><button className="auth-submit" disabled={busy}>{busy?"Creating account...":"Create account"}<ArrowRight size={17}/></button></form><div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div><div className="auth-legal">Your password is sent over the configured API connection and hashed by the backend before storage.</div></AuthShell>;
}
