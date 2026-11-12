import React, {useEffect, useState} from 'react';
import CrudTable from './components/CrudTable.jsx';
import {api, API_URL} from './helpers/helpFetch.js';

const sections = [
  {key:'productos', label:'Productos', icon:'📦', fields:[{key:'nombre',label:'Producto'},{key:'categoria',label:'Categoría',options:['Res','Cerdo','Pollo','Otros']},{key:'precio',label:'Precio de venta (COP)',type:'number',money:true},{key:'stock',label:'Existencias (kg/unidades)',type:'number'}]},
  {key:'clientes', label:'Clientes', icon:'👥', fields:[{key:'nombre',label:'Nombre completo'},{key:'telefono',label:'Teléfono',type:'tel'},{key:'direccion',label:'Dirección'}]},
  {key:'proveedores', label:'Proveedores', icon:'🚚', fields:[{key:'nombre',label:'Proveedor'},{key:'telefono',label:'Teléfono',type:'tel'},{key:'producto',label:'Producto suministrado'}]},
  {key:'compras', label:'Compras', icon:'🧾', fields:[{key:'fecha',label:'Fecha',type:'date'},{key:'proveedor',label:'Proveedor'},{key:'producto',label:'Producto'},{key:'cantidad',label:'Cantidad',type:'number'},{key:'total',label:'Valor total (COP)',type:'number',money:true}]},
  {key:'ventas', label:'Ventas', icon:'💳', fields:[{key:'fecha',label:'Fecha',type:'date'},{key:'cliente',label:'Cliente'},{key:'producto',label:'Producto'},{key:'cantidad',label:'Cantidad',type:'number'},{key:'total',label:'Valor total (COP)',type:'number',money:true},{key:'metodo',label:'Método de pago',options:['Efectivo','Transferencia','Tarjeta']}]}
];
export default function Negocio() {
  const [active, setActive] = useState(sections[0]);
  const [count, setCount] = useState({});
  const [connected, setConnected] = useState(false);
  async function refresh() {
    try {const lists = await Promise.all(sections.map(s=>api.list(s.key)));setCount(Object.fromEntries(sections.map((s,i)=>[s.key,lists[i].length])));setConnected(true);} catch {setConnected(false);}
  }
  useEffect(()=>{refresh();},[]);
  return <div className="app-layout">
    <aside className="sidebar"><div className="brand-icon">🥩</div><h1 className="fs-5 fw-bold mt-2 mb-0">LOMOS & LOMOS</h1><p className="small opacity-75">Express · POS académico</p><hr className="opacity-25"/><p className="small text-uppercase opacity-50 px-2">Administración</p>
      <nav className="d-grid gap-2" aria-label="Módulos del negocio">{sections.map(s=><button key={s.key} type="button" className={`nav-button ${active.key === s.key ? 'selected' : ''}`} onClick={()=>setActive(s)}><span>{s.icon} &nbsp;{s.label}</span><span className="mini-counter">{count[s.key] ?? '—'}</span></button>)}</nav><div className="sidebar-footer">Universidad Libre · Programación Web<br/>Laboratorio IV · 2026-II</div>
    </aside>
    <main className="main-area"><header className="topbar d-flex flex-wrap align-items-center justify-content-between gap-2"><div><div className="text-danger fw-bold small">SISTEMA DE GESTIÓN</div><h2 className="h3 fw-bold mb-0">Panel administrativo</h2></div><span className={`badge ${connected?'text-bg-success':'text-bg-danger'} rounded-pill px-3 py-2`}>{connected?'● API conectada':'● API desconectada'}</span></header>
      <div className="container-fluid px-0"><div className="welcome-panel mb-4"><h3 className="h4 fw-bold">Bienvenido a Lomos POS</h3><p className="mb-0 opacity-75">Administra los registros de tu negocio mediante operaciones CRUD y una API REST ficticia.</p></div>
      <div className="row g-3 mb-4">{sections.map(s=><div className="col-6 col-md-4 col-xl" key={s.key}><button className={`stat-card w-100 text-start ${active.key===s.key?'stat-active':''}`} onClick={()=>setActive(s)}><div className="fs-4">{s.icon}</div><div className="fs-3 fw-bold">{count[s.key]??'—'}</div><div className="text-muted small">{s.label}</div></button></div>)}</div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3"><div><h3 className="h4 fw-bold mb-1">{active.icon} Gestión de {active.label.toLowerCase()}</h3><p className="text-muted mb-0">Crear, leer, actualizar y eliminar registros.</p></div><button className="btn btn-outline-secondary" onClick={refresh}>↻ Actualizar indicadores</button></div>
      <CrudTable key={active.key} config={active} onChanged={refresh}/><footer className="mt-4 text-center text-muted small">API: {API_URL} · Datos demostrativos, no válidos para facturación real.</footer></div>
    </main>
  </div>;
}
