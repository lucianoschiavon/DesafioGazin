// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

import React, { useEffect, useMemo, useState } from 'react';
import {
  getNiveis, createNivel, updateNivel, deleteNivel,
  getDesenvolvedores, createDesenvolvedor, updateDesenvolvedor, deleteDesenvolvedor
} from './api';

// Normalizador de datas - garante formato compatível com input type="date"
/*function toISODate(v) {
  if (!v) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v; // já está OK
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {       // formato dd/mm/yyyy
    const [dd, mm, yyyy] = v.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
} */ 

// Converte várias entradas para yyyy-mm-dd 
// Evitar erros de fuso

function toISODate(v) {
  if (!v) return '';
  // já está ok
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // dd/mm/aaaa ou dd-mm-aaaa
  const m = String(v).match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) {
    const [_, d, mo, y] = m;
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // ISO com hora ou outro parseável. Usa UTC para não deslocar
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

// Prepara valor para o <input type="date">
function fromISODate(v) {
  if (!v) return '';
  // já no formato do input
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // dd/mm/aaaa ou dd-mm-aaaa
  const m = String(v).match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) {
    const [_, d, mo, y] = m;
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // ISO com hora etc.
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}  

// Auto-limpa mensagens após um tempo
function useAutoClearMessage(okMsg, setOkMsg, errMsg, setErrMsg, delay = 3500) {
  React.useEffect(() => {
    if (!okMsg && !errMsg) return;
    const t = setTimeout(() => {
      setOkMsg('');
      setErrMsg('');
    }, delay);
    return () => clearTimeout(t);
  }, [okMsg, errMsg, setOkMsg, setErrMsg, delay]);
}

// Ordenação local. Garante a reordenação visual mesmo se o backend ignorar sort/order
function localSort(rows, sort, order, tipo) {
  const getValue = (r) => {
    if (tipo === 'niveis') {
      if (sort === 'totalDevs') return r.totalDevs ?? 0;
      return r[sort];
    }
    // tipo devs
    if (sort === 'nivel') return r?.nivel?.nivel ?? '';
    return r[sort];
  };

  return [...rows].sort((a, b) => {
    const va = getValue(a);
    const vb = getValue(b);
    if (va == null && vb == null) return 0;
    if (va == null) return order === 'asc' ? -1 : 1;
    if (vb == null) return order === 'asc' ? 1 : -1;

    if (typeof va === 'number' && typeof vb === 'number') {
      return order === 'asc' ? va - vb : vb - va;
    }

    const cmp = String(va).localeCompare(String(vb), 'pt-BR', { numeric: true });
    return order === 'asc' ? cmp : -cmp;
  });
}

/* Componentes genéricos */

function Button({ children, ...props }) {
  return (
    <button
      style={{
        height: 36,
        padding: '0 12px',
        margin: '0 6px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/* ===== Estilo e campos comuns ===== */
const INPUT_STYLE = {
  height: 36,
  padding: '0 12px',
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 4,
  background: '#fff',
  outline: 'none'
};

function LabeledInput({ label, style, ...props }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6, color: '#374151' }}>{label}</div>
      <input {...props} style={{ ...INPUT_STYLE, ...style }} />
    </label>
  );
}

function LabeledSelect({ label, children, style, ...props }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 12, marginBottom: 6, color: '#374151' }}>{label}</div>
      <select {...props} style={{ ...INPUT_STYLE, ...style }}>
        {children}
      </select>
    </label>
  );
}

function Pagination({ meta, onPageChange }) {
  if (!meta) return null;
  const { current_page, last_page } = meta;

  return (
    <div style={{ marginTop: 12 }}>
      <Button disabled={current_page <= 1} onClick={() => onPageChange(current_page - 1)}>Anterior</Button>
      <span style={{ margin: '0 8px' }}>
        Página {current_page} de {last_page}
      </span>
      <Button disabled={current_page >= last_page} onClick={() => onPageChange(current_page + 1)}>Próxima</Button>
    </div>
  );
}

function Alert({ type = 'info', message }) {
  const bg = type === 'error' ? '#fde2e2' : '#e6f7e6';
  const color = type === 'error' ? '#9b1c1c' : '#1a7f37';
  if (!message) return null;
  return (
    <div style={{ background: bg, color, padding: 10, borderRadius: 4, marginBottom: 10 }}>
      {message}
    </div>
  );
}

/* Página: NÍVEIS */
function PageNiveis() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('asc');
  const [modalAberta, setModalAberta] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nivelForm, setNivelForm] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

   useAutoClearMessage(okMsg, setOkMsg, errMsg, setErrMsg);
   
  async function carregar() {
    setLoading(true);
    setErrMsg('');
    try {
      const resp = await getNiveis({ page, limit: 10, nivel: filtro, sort, order });
      //setRows(resp.data); # Removido para forçar ordenação local 11/11/2025 19:57
      setRows(localSort(resp.data, sort, order, 'niveis')); 
      setMeta(resp.meta);
    } catch (e) {
      setErrMsg(e.message || 'Erro ao buscar níveis');
      setRows([]);
      setMeta({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [page, sort, order]);

  function handleSort(campo) {
    if (campo === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(campo);
      setOrder('asc');
    }
  }

  function abrirCriar() {
    setEditando(null);
    setNivelForm('');
    setModalAberta(true);
  }

  function abrirEditar(row) {
    setEditando(row);
    setNivelForm(row.nivel);
    setModalAberta(true);
  }

  async function salvar() {
    setErrMsg('');
    setOkMsg('');
    try {
      if (!nivelForm.trim()) return setErrMsg('Informe o nome do nível');
      if (editando) {
        await updateNivel(editando.id, { nivel: nivelForm.trim() });
        setOkMsg('Nível atualizado com sucesso');
      } else {
        await createNivel({ nivel: nivelForm.trim() });
        setOkMsg('Nível criado com sucesso');
      }
      setModalAberta(false);
      setPage(1);
      await carregar();
    } catch (e) {
      setErrMsg(e.message || 'Erro ao salvar nível');
    }
  }

  async function remover(id) {
    if (!window.confirm('Tem certeza que deseja excluir este nível?')) return;
    try {
      await deleteNivel(id);
      setOkMsg('Nível removido com sucesso');
      await carregar();
    } catch (e) {
      setErrMsg(e?.data?.mensagem || e.message || 'Erro ao remover nível');
    }
  }

  async function aplicarFiltro() {
    setPage(1);
    await carregar();
  }

  return (
    <div>
      <h2>Níveis</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Exemplo, Pleno"
          aria-label="Buscar por nome do nível"
          style={{ height: 36, padding: '0 12px', width: 320, minWidth: 220 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={aplicarFiltro}>Buscar</Button>
          <Button onClick={abrirCriar}>Novo nível</Button>
        </div>
      </div>

      <Alert type="success" message={okMsg} />
      <Alert type="error" message={errMsg} />

      {loading ? <p>Carregando...</p> : (
        <>
          <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'nivel', label: 'Nível' },
                  { key: 'totalDevs', label: 'Qtde Devs' }
                ].map(({ key, label }) => (
                  <th key={key}>
                    <button
                      onClick={() => handleSort(key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {label}{sort === key ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                    </button>
                  </th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Nenhum nível encontrado</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nivel}</td>
                  <td>{r.totalDevs ?? 0}</td>
                  <td>
                    <Button onClick={() => abrirEditar(r)}>Editar</Button>
                    <Button onClick={() => remover(r.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

      {modalAberta && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', padding: 16, width: 400, borderRadius: 6 }}>
            <h3>{editando ? 'Editar nível' : 'Novo nível'}</h3>
            <LabeledInput
              label="Nome do nível"
              value={nivelForm}
              onChange={(e) => setNivelForm(e.target.value)}
              placeholder="Exemplo, Júnior"
            />
            <div style={{ marginTop: 12 }}>
              <Button onClick={salvar}>Salvar</Button>
              <Button onClick={() => setModalAberta(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Página: DESENVOLVEDORES */
function PageDevs() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('asc');
  const [modalAberta, setModalAberta] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    sexo: 'M',
    data_nascimento: '',
    hobby: '',
    nivel_id: ''
  });
  const [niveis, setNiveis] = useState([]);
  const [okMsg, setOkMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useAutoClearMessage(okMsg, setOkMsg, errMsg, setErrMsg);
  
  async function carregar() {
  setLoading(true);
  setErrMsg('');   // só limpa erros, não mensagens de sucesso
  try {
    const resp = await getDesenvolvedores({ page, limit: 10, nome: filtro, sort, order });
    setRows(localSort(resp.data, sort, order, 'devs'));
    setMeta(resp.meta);
  } catch (e) {
    setErrMsg(e.message || 'Erro ao buscar desenvolvedores');
    setRows([]);
    setMeta({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  } finally {
    setLoading(false);
  }
}

  useEffect(() => { carregar(); }, [page, sort, order]);

  function handleSort(campo) {
    if (campo === sort) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSort(campo);
      setOrder('asc');
    }
  }

  function abrirCriar() {
    setEditando(null);
    setForm({ nome: '', sexo: 'M', data_nascimento: '', hobby: '', nivel_id: '' });
    carregarNiveisSelect();
    setModalAberta(true);
  }

  async function carregarNiveisSelect() {
    try {
      const resp = await getNiveis({ page: 1, limit: 50 });
      setNiveis(resp.data);
    } catch {
      setNiveis([]);
    }
  }

  function abrirEditar(row) {
  setEditando(row);
  setForm({
    nome: row.nome,
    sexo: row.sexo,
    data_nascimento: fromISODate(row.data_nascimento),
    hobby: row.hobby,
    nivel_id: row?.nivel?.id || ''
  });
  carregarNiveisSelect();
  setModalAberta(true);
}

  async function salvar() {
    setErrMsg('');
    setOkMsg('');
    try {
      if (!form.nome.trim()) return setErrMsg('Informe o nome');
      if (!form.data_nascimento) return setErrMsg('Informe a data de nascimento');
      if (!form.hobby.trim()) return setErrMsg('Informe o hobby');
      if (!form.nivel_id) return setErrMsg('Selecione um nível');

      const payload = {
        ...form,
        nivel_id: Number(form.nivel_id),
        data_nascimento: toISODate(form.data_nascimento)
    };

      if (editando) {
        await updateDesenvolvedor(editando.id, payload);
        setOkMsg('Desenvolvedor atualizado com sucesso');
      } else {
        await createDesenvolvedor(payload);
        setOkMsg('Desenvolvedor criado com sucesso');
      }

      setModalAberta(false);
      setPage(1);
      await carregar();
    } catch (e) {
      setErrMsg(e.message || 'Erro ao salvar desenvolvedor');
    }
  }

  async function remover(id) {
    if (!window.confirm('Tem certeza que deseja excluir este desenvolvedor?')) return;
    try {
      await deleteDesenvolvedor(id);
      setOkMsg('Desenvolvedor removido com sucesso');
      await carregar();
    } catch (e) {
      setErrMsg(e.message || 'Erro ao remover desenvolvedor');
    }
  }

  return (
    <div>
      <h2>Desenvolvedores</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Exemplo, Ana"
          style={{ height: 36, padding: '0 12px', width: 320, minWidth: 220 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => { setPage(1); carregar(); }}>Buscar</Button>
          <Button onClick={abrirCriar}>Novo desenvolvedor</Button>
        </div>
      </div>

      <Alert type="success" message={okMsg} />
      <Alert type="error" message={errMsg} />

      {loading ? <p>Carregando...</p> : (
        <>
          <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                {[{ key: 'id', label: 'ID' }, { key: 'nome', label: 'Nome' }, { key: 'sexo', label: 'Sexo' },
                  { key: 'data_nascimento', label: 'Nascimento' }, { key: 'idade', label: 'Idade' },
                  { key: 'hobby', label: 'Hobby' }, { key: 'nivel', label: 'Nível' }].map(({ key, label }) => (
                  <th key={key}>
                    <button
                      onClick={() => handleSort(key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {label}{sort === key ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                    </button>
                  </th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Nenhum desenvolvedor encontrado</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nome}</td>
                  <td>{r.sexo}</td>
                  <td>{r.data_nascimento}</td>
                  <td>{r.idade ?? '-'}</td>
                  <td>{r.hobby}</td>
                  <td>{r?.nivel?.nivel || '-'}</td>
                  <td>
                    <Button onClick={() => abrirEditar(r)}>Editar</Button>
                    <Button onClick={() => remover(r.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />

          {modalAberta && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div style={{ background: '#fff', padding: 16, width: 420, borderRadius: 6 }}>
                <h3>{editando ? 'Editar desenvolvedor' : 'Novo desenvolvedor'}</h3>

                <LabeledInput label="Nome" value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })} />

                <LabeledSelect label="Sexo" value={form.sexo}
                  onChange={(e) => setForm({ ...form, sexo: e.target.value })}>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </LabeledSelect>

                <LabeledInput
                  label="Data de nascimento"
                  type="date"
                  value={form.data_nascimento || ''}
                  onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
                />

                <LabeledInput label="Hobby" value={form.hobby}
                  onChange={(e) => setForm({ ...form, hobby: e.target.value })} />

                <LabeledSelect label="Nível" value={form.nivel_id}
                  onChange={(e) => setForm({ ...form, nivel_id: e.target.value })}>
                  <option value="">Selecione...</option>
                  {niveis.map((n) => (
                    <option key={n.id} value={n.id}>{n.nivel}</option>
                  ))}
                </LabeledSelect>

                <div style={{ marginTop: 12 }}>
                  <Button onClick={salvar}>Salvar</Button>
                  <Button onClick={() => setModalAberta(false)}>Cancelar</Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* App principal */
export default function App() {
  const [tab, setTab] = useState('niveis');
  const titulo = useMemo(() => tab === 'niveis' ? 'Cadastro de Níveis' : 'Cadastro de Desenvolvedores', [tab]);

  return (
    <div style={{ maxWidth: 980, margin: '24px auto', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Cadastro de Desenvolvedores</h1>
        <nav>
          <Button onClick={() => setTab('niveis')} disabled={tab === 'niveis'}>Níveis</Button>
          <Button onClick={() => setTab('devs')} disabled={tab === 'devs'}>Desenvolvedores</Button>
        </nav>
      </header>

      <main>
        <h2 style={{ marginTop: 0 }}>{titulo}</h2>
        {tab === 'niveis' ? <PageNiveis /> : <PageDevs />}
      </main>
    </div>
  );
}
