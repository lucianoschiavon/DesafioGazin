Ajustar Cors para Produção index.js


app.use(cors({
  origin: ['https://meusite.com', 'https://app.meusite.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
