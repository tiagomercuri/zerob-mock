module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  // Separa path e query string para reescrever corretamente os paths /api/pesquisa/...
  const partes = req.url.split('?');
  const path = partes[0];
  const qs = partes[1] ? '?' + partes[1] : '';
  let novoCaminho = null;

  if (path === '/api/etapas')                          novoCaminho = '/etapas';
  else if (path === '/api/sistemas')                   novoCaminho = '/sistemas';
  else if (path === '/api/pesquisa/lista/areas')       novoCaminho = '/areas';
  else if (path === '/api/pesquisa/lista/etapas')      novoCaminho = '/etapas';
  else if (path === '/api/pesquisa/lista/sistemas')    novoCaminho = '/sistemas';
  else if (path === '/api/pesquisa/lista')             novoCaminho = '/pesquisa';
  else if (path.startsWith('/api/pesquisa/cadastro/'))
    novoCaminho = '/pesquisa/' + path.replace('/api/pesquisa/cadastro/', '');
  else if (path === '/api/pesquisa/cadastro')          novoCaminho = '/pesquisa';
  else if (/^\/api\/pesquisa\/resposta\/[^/]+\/consulta$/.test(path)) novoCaminho = '/resposta';
  else if (path === '/api/pesquisa/resposta')          novoCaminho = '/resposta';
  else if (path.startsWith('/api/pesquisa/dashboard/'))
    novoCaminho = '/dashboard/' + path.replace('/api/pesquisa/dashboard/', '');
  else if (path === '/api/pesquisa') {
    // Mock não filtra por idSistema/etapa — retorna a pesquisa pelo id diretamente
    const params = new URLSearchParams(partes[1] || '');
    const idPesquisa = params.get('idPesquisa');
    req.url = idPesquisa ? '/pesquisa/' + idPesquisa : '/pesquisa';
    return next();
  }

  if (novoCaminho) req.url = novoCaminho + qs;

  next();
};
