2. DIAGRAMA UML (ASCII)

===============================================================

+--------------------+
|      Nivel         |
+--------------------+
| id: integer        |
| nivel: string      |
| created_at         |
| updated_at         |
+--------------------+
          1
          |
          | possui
          |
          N
+---------------------------+
|     Desenvolvedor         |
+---------------------------+
| id: integer               |
| nivel_id: integer         |
| nome: string              |
| sexo: char                |
| data_nascimento: date     |
| hobby: string             |
| created_at                |
| updated_at                |
+---------------------------+


Fluxo backend:

Rotas --> Controller --> Validacao --> Model --> Banco
                      <-- Resposta JSON


===============================================================

3. FLUXOGRAMA DA API

===============================================================

                +----------------------+
                |   Requisição HTTP    |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |       Rotas          |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |     Controller       |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |   Validacao Payload  |
                +----------+-----------+
                           |
                      valido?
                       /    \
                      /      \
             nao     v        v    sim
                  retorna     continua
                 400 erro      
                           |
                           v
                +----------------------+
                |        Model         |
                |   (Sequelize ORM)   |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |     PostgreSQL       |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |  Resposta JSON       |
                +----------------------+