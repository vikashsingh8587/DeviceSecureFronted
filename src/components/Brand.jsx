import React from "react";
import { ShieldCheck } from "lucide-react";
export default function Brand({ compact = false }) {
  return <div className={`brand ${compact ? "brand-compact" : ""}`}><div className="brand-mark"><ShieldCheck size={23}/></div><div><div className="brand-name">OmniGuard</div><div className="brand-caption">DEVICE SECURITY CENTER</div></div></div>;
}
