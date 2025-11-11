-- Criação da tabela de níveis
CREATE TABLE niveis (
  id SERIAL PRIMARY KEY,           -- Identificador único do nível (gerado automaticamente)
  nivel VARCHAR(255) NOT NULL      -- Nome do nível (ex: Júnior, Pleno, Sênior)
);

-- Criação da tabela de desenvolvedores
CREATE TABLE desenvolvedores (
  id SERIAL PRIMARY KEY,           -- Identificador único do desenvolvedor (gerado automaticamente)
  nome VARCHAR(255) NOT NULL,      -- Nome completo do desenvolvedor
  sexo CHAR(1) NOT NULL,           -- Sexo do desenvolvedor (M ou F)
  data_nascimento DATE NOT NULL,   -- Data de nascimento
  hobby VARCHAR(255),              -- Hobby do desenvolvedor (opcional)
  nivel_id INTEGER NOT NULL,       -- Chave estrangeira que referencia o nível
  CONSTRAINT fk_nivel
    FOREIGN KEY (nivel_id)
    REFERENCES niveis(id)
    ON DELETE RESTRICT             -- Impede exclusão de nível se houver desenvolvedores associados
);