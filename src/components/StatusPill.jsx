import React from "react";
export default function StatusPill({ status }) {
  const value = String(status ?? "unknown");
  const key = value.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill ${key}`}><i/>{value}</span>;
}
