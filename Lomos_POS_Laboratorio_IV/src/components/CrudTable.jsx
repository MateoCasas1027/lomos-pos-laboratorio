import React, {useEffect, useMemo, useState} from 'react';
import {api} from '../helpers/helpFetch';

export default function CrudTable({config, onChanged}) {
  const {key: resource, label, fields} = config;
  const empty = useMemo(() => Object.fromEntries(fields.map(f => [f.key, ''])), [fields]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    setError('');
    try {setRows(await api.list(resource));} catch(e) {setError(`${e.message}. Comprueba que json-server está ejecutándose en el puerto 3001.`);}
  }
  useEffect(() => {setRows([]); setForm(empty); setEditingId(null); setSearch(''); setSuccess(''); load();}, [resource, empty]);
  const visible = rows.filter(row => Object.values(row).some(v => String(v ?? '').toLowerCase().includes(search.toLowerCase())));
  function normalize() {
    return Object.fromEntries(fields.map(f => [f.key, f.type === 'number' ? Number(form[f.key]) : String(form[f.key]).trim()]));
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(''); setSuccess('');
    try {
      const payload = normalize();
      if (editingId === null) await api.create(resource, payload);
      else await api.update(resource, editingId, {id: editingId, ...payload});
      setSuccess(editingId === null ? 'Registro creado correctamente.' : 'Registro actualizado correctamente.');
      setForm(empty); setEditingId(null); await load(); onChanged?.();
    } catch(e) {setError(e.message);} finally {setBusy(false);}
  }
  function edit(row) {
    setEditingId(row.id);
    setForm(Object.fromEntries(fields.map(f => [f.key, row[f.key] ?? ''])));
    setError(''); setSuccess('');
    window.scrollTo({top: 0, behavior:'smooth'});
  }
  async function remove(row) {
    if (!window.confirm(`¿Eliminar el registro #${row.id} de ${label.toLowerCase()}?`)) return;
    setBusy(true); setError(''); setSuccess('');
    try {await api.remove(resource, row.id); setSuccess('Registro eliminado.'); await load(); onChanged?.();}
    catch(e) {setError(e.message);} finally {setBusy(false);}
  }
  const currency = val => new Intl.NumberFormat('es-CO', {style:'currency', currency:'COP', maximumFractionDigits:0}).format(Number(val) || 0);
  return <>
    <div className="row g-4">
      <div className="col-lg-4"><section className="panel h-100">
        <h2 className="h5 mb-3">{editingId === null ? `Nuevo registro de ${label.toLowerCase()}` : `Editar registro #${editingId}`}</h2>
        <form onSubmit={submit}>{fields.map(f => <div className="mb-3" key={f.key}>
          <label className="form-label fw-semibold" htmlFor={`field-${f.key}`}>{f.label}</label>
          {f.options ? <select className="form-select" id={`field-${f.key}`} required value={form[f.key]} onChange={e => setForm({...form, [f.key]:e.target.value})}><option value="">Seleccione...</option>{f.options.map(o => <option key={o} value={o}>{o}</option>)}</select>
          : <input className="form-control" id={`field-${f.key}`} type={f.type || 'text'} step={f.type === 'number' ? 'any' : undefined} min={f.type === 'number' ? 0 : undefined} required value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.label}/>}
        </div>)}
          <div className="d-flex gap-2"><button type="submit" disabled={busy} className="btn btn-danger flex-grow-1">{busy ? 'Guardando…' : editingId === null ? 'Crear registro' : 'Guardar cambios'}</button>{editingId !== null && <button type="button" className="btn btn-outline-secondary" onClick={() => {setEditingId(null);setForm(empty);}}>Cancelar</button>}</div>
        </form>
      </section></div>
      <div className="col-lg-8"><section className="panel h-100">
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3"><h2 className="h5 m-0">Listado de {label.toLowerCase()} <span className="badge text-bg-light">{visible.length}</span></h2><input className="form-control search-box" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar registros…" aria-label="Buscar registros"/></div>
        {error && <div role="alert" className="alert alert-danger">{error}</div>}{success && <div role="status" className="alert alert-success">{success}</div>}
        <div className="table-responsive"><table className="table table-hover align-middle"><thead><tr><th>ID</th>{fields.map(f=><th key={f.key}>{f.label}</th>)}<th>Acciones</th></tr></thead><tbody>
          {visible.length === 0 ? <tr><td className="text-center text-muted py-4" colSpan={fields.length+2}>No hay registros para mostrar.</td></tr> : visible.map(row=><tr key={row.id}><td>#{row.id}</td>{fields.map(f=><td key={f.key}>{f.money ? currency(row[f.key]) : String(row[f.key] ?? '')}</td>)}<td><div className="d-flex gap-1"><button type="button" className="btn btn-sm btn-outline-primary" disabled={busy} onClick={()=>edit(row)}>Editar</button><button type="button" className="btn btn-sm btn-outline-danger" disabled={busy} onClick={()=>remove(row)}>Eliminar</button></div></td></tr>)}
        </tbody></table></div>
      </section></div>
    </div>
  </>;
}
