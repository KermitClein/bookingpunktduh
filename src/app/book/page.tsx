'use client';
import { useEffect, useMemo, useState } from "react";

type Resource = { id:string; name:string; type:string; rules:any; pricing:any[] };
export default function BookPage({ searchParams }: any) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceId, setResourceId] = useState<string>("");
  const [from, setFrom] = useState<string>(()=> new Date().toISOString());
  const [to, setTo] = useState<string>(()=> new Date(Date.now()+7*24*3600e3).toISOString());
  const [slots, setSlots] = useState<{start:string,end:string}[]>([]);
  const [unit, setUnit] = useState<"hour"|"day">("hour");

  useEffect(() => {
    fetch('/api/resources').then(r=>r.json()).then(setResources);
  }, []);

  useEffect(() => {
    if (!resourceId) return;
    const url = new URL(location.origin + "/api/availability");
    url.searchParams.set("resourceId", resourceId);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    fetch(url.toString()).then(r=>r.json()).then(d=>{ setSlots(d.slots||[]); setUnit(d.unit)});
  }, [resourceId, from, to]);

  const selected = useMemo(()=>resources.find(r=>r.id===resourceId),[resources,resourceId]);

  return (
    <div className="container">
      <h1>Buchen</h1>
      <div className="grid">
        <div className="card">
          <label className="label">Ressource</label>
          <select className="input" value={resourceId} onChange={e=>setResourceId(e.target.value)}>
            <option value="">– auswählen –</option>
            {resources.map(r=> <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
          </select>
          <label className="label" style={{marginTop:8}}>Von (ISO)</label>
          <input className="input" value={from} onChange={e=>setFrom(e.target.value)}/>
          <label className="label" style={{marginTop:8}}>Bis (ISO)</label>
          <input className="input" value={to} onChange={e=>setTo(e.target.value)}/>
        </div>

        <div className="card">
          <h3>Verfügbare {unit==="hour"?"Slots (Stunden)":"Slots (Tage)"}</h3>
          {slots.length===0 && <p>Keine Slots im Bereich.</p>}
          <ul>
            {slots.slice(0,50).map(s=>(
              <li key={s.start}>
                {new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
