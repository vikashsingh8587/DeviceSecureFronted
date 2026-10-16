import React from "react";
export function PageHeader({ title, description, action }) { return <div className="page-heading"><div><h2>{title}</h2><p>{description}</p></div>{action}</div>; }
export function Panel({ children, className = "" }) { return <section className={`panel ${className}`}>{children}</section>; }
export function Notice({ children, kind = "info", onClose }) { if(!children) return null; return <div className={`notice ${kind}`}><span>{children}</span>{onClose&&<button onClick={onClose}>×</button>}</div>; }
export function Loading({ label = "Loading data..." }) { return <div className="loading"><span className="spinner"/>{label}</div>; }
export function Empty({ title, description }) { return <div className="empty"><div className="empty-symbol">◇</div><strong>{title}</strong><p>{description}</p></div>; }
export function Field({ label, error, ...props }) { return <label className="field"><span>{label}</span><input {...props}/>{error&&<small className="field-error">{error}</small>}</label>; }
