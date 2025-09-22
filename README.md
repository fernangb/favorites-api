# Favorites API

API para gerenciar os produtos favoritos dos clientes.

---

<details>
<summary>Tecnologias</summary>

- **Linguagem/Framework:** Node.js, NestJS
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Container:** Docker / Docker Compose
- **Testes:** Jest e Supertest
- **Documentação:** Swagger (OpenAPI)
</details>

---

<details>
<summary>Configuração de Ambiente</summary>

1. Clone o repositório:
```bash
git clone https://github.com/fernangb/favorites-api
cd favorites-api
```
2. Instale as dependências:
```bash
npm install
```
3. Crie um arquivo .env
```bash
cp .env.example .env
```
4. Adicione os valores nas variáveis de ambiente

5. Rode o Docker:
```bash
docker-compose up -d
```

6. Rode a API:
```bash
npm run start:dev
```

7. Accesse a documentação do Swagger: http://localhost:3000/api

</details>

---

<details> <summary>🧪 Testes</summary>

1. Testes unitários:
```bash
npm run test
```

2. Testes unitários (com cobertura, gerado em coverage/):
```bash
npm run test
```

</details>

---


<details>
<summary>Arquitetura e Estrutura do Projeto</summary>

1. **Domain Driven Design (DDD)**
- Foco no domínio e nas regras de negócio

Eu comecei mapeando os contextos do sistema e como eles se relacionam entre si.
- Identity: cadastro e login de clientes
- Customer: clientes
- Products: produtos
- Favorites: lista de produtos dos clientes
- Shared: módulos reutilizáveis entre contextos (database, auth, etc)

2. **Clean Architecture**
- Separa responsabilidades por camadas
- Facilita flexibilidade e testabilidade
- Infraestrutura isolada, facilitando manutenção e troca de providers, sem impactar o sistema

Eu ajustei algumas características, de forma a simplificar a solução
- Simplifiquei o uso de interfaces, focando mais em facilitar a testabilidade e sem engessar a implementação
- Não utilizei use cases. Prefiri manter dentro da camada de services, para facilitar a reutilização do código

Com isso, temos as seguintes camadas:
- Domain/: entidades e regras puras. O coração do sistema
- Application: regras de negócio
- Infrastructure: camadas externas, controllers, banco de dados, etc

![Diagrama da Arquitetura](./docs/clean-arch.jpg)

3. **Monolito modular**
Eu utilizei da estrutura de um monolito modular, pois ele traz o melhor dos dois mundos:
- Simplifica o sistema dentro de um monolito
- Facilidade em escalar para novos microsserviços, sem impactar o resto do sistema
- Facilidade de manutenção

Cada contexto delimitado pelo DDD está em um módulo separado, podendo se comunicar entre si.

4. **Repository**
- Abstrai acesso ao banco de dados

Eu utilizei o TypeORM para me conectar com o banco. Adicionei uma interface que permitisse ao service não saber dos detalhes da implementação, mas apenas do contrato.
No mundo real é bem mais difícil de trocar de banco de dados, o que adicionaria um over-engineering para essa solução (adiciona uma camada de mapper para converter um model de banco de dados para uma entidade de domínio, e vice-versa). Apesar disso, existe a possibilidade de trocar de ORM (TypeORM, Prisma, Knex, etc). Eu segui com essa solução pensando por esse motivo.

</details>

---

<details>
<summary>Decisões Técnicas e Justificativas</summary>

1. **Autorização e Autenticação**
- Autenticação: clientes precisam estar logados no sistema
- Autorização: clientes só podem acessar seus próprios dados

Para isso, eu criei guards customizados, utilizando token JWT para validar autenticação e autorização, de forma a serem implantados dentro dos controllers
[Guards do NestJS](https://docs.nestjs.com/websockets/guards)

Com isso, temos dois tipos de endpoints:
- Públicos: sem a necessidade de token
- Protegidos: disponíveis apenas se estiverem autenticados e autorizados

2. **Produtos**
Existe uma API para produtos, mas ela não estava disponível. Dessa forma, eu implementei manualmente essa parte. Como eles viriam de um outro serviço, eles ficaram públicos.
Eu utilizei o banco PostgreSQL para inserir os dados. Essa escolha se deve ao fato de simplificar a solução, sem a necessidade de subir uma nova instância no Docker. Quanto mais dependências externas, mais pontos de falha no sistema.
Mesmo estando no mesmo banco de dados, eu não criei um relacionamento entre eles, para simular ao máximo como se fosse um sistema externo.
Eu criei um seed para inserir os dados na tabela de produtos, mas deixei a implementação que se conecta com o endpoint, caso esteja disponível.
- /v1/products: seed do banco de dados
- /v2v/products: API externa

3. **Testes**
- Testes unitários: mockando dependências externas
- Testes de integração: criando instância em memória de banco de dados, simulando um comportamento próximo ao real
- Testes e2e: chamando o endpoint

Eu precisei substituir os testes e2e dos controllers para testes unitários. Ao adicionar a camada de autenticação e autorização, os testes falhavam pois as senhas codificadas e os tokens JWT não correspondiam.

4. **Transaction**
De forma a garantir atomicidade e consistência, eu englobei alguns serviços com transactions. Caso ocorra alguma erro, toda a operação é revertida automaticamente.

---


