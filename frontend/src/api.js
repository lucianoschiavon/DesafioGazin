// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

const baseURL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:3001`;
 // ajuste retirado http://backend:3001 modificado por erro network no docker com  env var e fallback automatico

// Função auxiliar para montar querystring de paginação e busca
function buildQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      usp.set(k, v);
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

// Função auxiliar que trata respostas JSON e códigos de erro
async function handleResponse(res) {
  // 204 – sem corpo
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    // repassa a mensagem e erros do backend quando houver
    const err = new Error(data.mensagem || 'Erro na requisição');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* NÍVEIS */
export async function getNiveis({ page = 1, limit = 10, nivel = '', sort, order } = {}) {
  const params = { page, limit, nivel };
  if (sort) params.sort = sort;
  if (order) params.order = order;

  const qs = buildQuery(params);
  const res = await fetch(`${baseURL}/api/niveis${qs}`);
  try {
    return await handleResponse(res);
  } catch (e) {
    // 404 significa nenhum registro. Vamos padronizar como lista vazia para o frontend.
    if (e.status === 404) {
      return { data: [], meta: { total: 0, per_page: limit, current_page: page, last_page: 1 } };
    }
    throw e;
  }
}

export async function createNivel(payload) {
  const res = await fetch(`${baseURL}/api/niveis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateNivel(id, payload) {
  const res = await fetch(`${baseURL}/api/niveis/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteNivel(id) {
  const res = await fetch(`${baseURL}/api/niveis/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}


/* DESENVOLVEDORES */
export async function getDesenvolvedores({ page = 1, limit = 10, nome = '', sort, order } = {}) {
  const params = { page, limit, nome };
  if (sort) params.sort = sort;
  if (order) params.order = order;

  const qs = buildQuery(params);
  const res = await fetch(`${baseURL}/api/desenvolvedores${qs}`);
  try {
    return await handleResponse(res);
  } catch (e) {
    if (e.status === 404) {
      return { data: [], meta: { total: 0, per_page: limit, current_page: page, last_page: 1 } };
    }
    throw e;
  }
}

export async function createDesenvolvedor(payload) {
  const res = await fetch(`${baseURL}/api/desenvolvedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateDesenvolvedor(id, payload) {
  const res = await fetch(`${baseURL}/api/desenvolvedores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteDesenvolvedor(id) {
  const res = await fetch(`${baseURL}/api/desenvolvedores/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}