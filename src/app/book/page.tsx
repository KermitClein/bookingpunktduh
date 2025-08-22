'use client';
import { useEffect, useMemo, useState } from "react";

type Pricing = { unit:'hour'|'day'; basePrice:number };
type Resource = { id:string; name:string; type:'car'|'boat'; rules?:any; pricing:Pricing[] };

function money(c:number){ return (c/100).toFixed(2).replace('.', ',') + ' €'; }

export default function BookPage() {
  const [resources,setResources] = useState<Resource[]>([]);
  const [rid,setRid] = useState("");
  const res = useMemo(()=> resources.find(r=>r.id===rid),[resources,rid]);
  const unit: 'hour'|'day' = (res?.rules?.unit) || (res?.type==='car'?'hour':'day');

  // Stunden-basiert
  const [date,setDate] = useState(()=> new Date().toISOString().slice(0,10));
  const [time,setTime] = useState("10:00");
  const [durH,setDurH] = useState(2);

  // Tages-basiert
  const [from,setFrom] = useState(()=> new Date().toISOString().slice(0,10));
  const [to,setTo]     = useState(()=> new Date(Date.now()+86400000).toISOString().slice(0,10));

  useEffect(()=>{
    fetch('/api/resources').then(r=>r.json()).then((j:Resource[])=>{
      setResources(j);
      const d = j[0]; if(d) setRid(d.id);
    });
  },[]);

  const price = useMemo(()=>{
    const p = res?.pricing.find(x=>x.unit===unit)?.basePrice ?? 0;
    if(!p) return 0;
    if(unit==='day'){
      const start = new Date(from); const end = new Date(to);
      const days = Math.max(1, Math.ceil((end.getTime()-start.getTime())/86400000));
      return days * p;
    } else {
      const hours = Math.max(1, durH|0);
      return hours * p;
    }
  },[res, unit, from, to, durH]);

  async function book(){
    if(!res) return alert("Ressource wählen");
    let start: Date, end: Date;
    if(unit==='day'){ start = new Date(from); end = new Date(to); }
    else { start = new Date(`${date}T${time}:00`); end = new Date(start.getTime()+ durH*3600e3); }

    const b = await fetch('/api/book',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ resourceId: res.id, startTs: start, endTs: end })
    }).then(r=>r.json());
    if(b.error) return alert(b.error);

    // Checkout (Dummy oder Stripe – siehe Schritt 2)
    const co = await fetch('/api/checkout', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ bookingId: b.bookingId, unit })
    }).then(r=>r.json());
    if(co.error) return alert(co.error);
    if(co.url) window.location.href = co.url;
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Buchen</h1>

      <div className="grid-layout">
        <div className="card">
          <label className="label">Ressource</label>
          <select className="input" value={rid} onChange={e=>setRid(e.target.value)}>
            {resources.map(r=> <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
          </select>

          {unit==='day' ? (
            <div className="mt-3">
              <div className="label">Zeitraum</div>
              <div className="flex gap-2">
                <input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
                <input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <div className="label">Datum & Zeit</div>
              <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
              <div className="flex gap-2 mt-2">
                <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} />
                <input className="input max-w-[120px]" type="number" min={1} max={12}
                  value={durH} onChange={e=>setDurH(parseInt(e.target.value||'1',10))} />
                <span className="label self-center">Stunden</span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg">Zusammenfassung</h3>
          <p><b>Ressource:</b> {res?.name ?? "–"}</p>
          <p><b>Einheit:</b> {unit}</p>
          <p><b>Gesamt:</b> {price ? money(price) : "–"}</p>
          <button className="btn mt-3" onClick={book}>Zur Kasse</button>
          <p className="label mt-2">Hinweis: Checkout kann testweise auf Dummy gestellt werden.</p>
        </div>
      </div>
    </div>
  );
}
