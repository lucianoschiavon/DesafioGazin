// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// ordem funcional: importacoes, configuracao do express, teste de conexao
//                  sincronizacao dos modelos, definicao de rotas e iniciar


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';

// Ponto de entrada da SPA
// Mantemos o StrictMode e renderizamos o App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
