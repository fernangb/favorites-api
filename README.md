# Favorites API

API para gerenciar os produtos favoritos dos clientes.

---

<details>
<summary><b>Tecnologias</b></summary>

- **Linguagem/Framework:** Node.js, NestJS
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Container:** Docker / Docker Compose
- **Testes:** Jest e Supertest
- **Documentação:** Swagger (OpenAPI)
</details>

---

<details>
<summary><b>Configuração de Ambiente</b></summary>

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

<details>
<summary><b>Testes</b></summary>

1. Testes unitários:
```bash
npm run test
```

2. Testes unitários (com cobertura, gerado em coverage/):
```bash
npm run test:cov
```

</details>

---

<details>
<summary><b>Decisões Técnicas</b></summary>

1. **Domain Driven Design (DDD)**
- Foco no domínio e nas regras de negócio

Eu comecei mapeando os contextos do sistema e como eles se relacionam entre si.
- **Identity:** cadastro e login de clientes
- **Customer:** clientes
- **Products:** produtos
- **Favorites:** lista de produtos dos clientes
- **Shared:** módulos compartilhados entre contextos (database, auth, etc)

2. **Clean Architecture**
- Separa responsabilidades por camadas
- Facilita flexibilidade e testabilidade
- Infraestrutura isolada, facilitando manutenção e troca de providers, sem impactar o sistema

Eu ajustei algumas características, de forma a simplificar a solução
- Simplifiquei o uso de interfaces, focando mais em facilitar a testabilidade e sem engessar a implementação
- Não utilizei use cases. Prefiri manter dentro da camada de services, para facilitar a reutilização do código

Com isso, temos as seguintes camadas:
- **Domain**: entidades e regras puras. O coração do sistema
- **Application**: regras de negócio
- **Infrastructure**: camadas externas, controllers, banco de dados, etc

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

5. **Autorização e Autenticação**
- Autenticação: clientes precisam estar logados no sistema
- Autorização: clientes só podem acessar seus próprios dados

Para isso, eu criei guards customizados, utilizando token JWT para validar autenticação e autorização, de forma a serem implantados dentro dos controllers.

Documentação: [Guards do NestJS](https://docs.nestjs.com/websockets/guards)

Com isso, temos dois tipos de endpoints:
- Públicos: sem a necessidade de token
- Protegidos: disponíveis apenas se estiverem autenticados e autorizados

Eu separei a parte da senha de clientes, de forma que cada contexto possa escalar separadamente.

6. **Produtos**
Existe uma API para produtos, mas ela não estava disponível. Dessa forma, eu implementei manualmente essa parte, mockando a resposta quando o sistema executa. Isso simplificou a solução, sem a necessidade de configurar banco de dados.

Apesar disso, o serviço se conecta com a API externa, sendo controlado por variáveis de ambiente (no .env)
```bash
IS_MOCKED=true
```
7. **Testes**
- Testes unitários: mockando dependências externas
- Testes de integração: criando instância em memória de banco de dados, simulando um comportamento próximo ao real

O sistema possui cobertura de 100%.

8. **Transaction**
De forma a garantir atomicidade e consistência, eu englobei alguns serviços com transactions. Caso ocorra alguma erro, toda a operação é revertida automaticamente.

9. **Log**
De forma a facilitar a análise e troubleshooting, eu adicionei logs personalizados e padronizados, com um traceId próprio. Ele é gerado como um UUID único, que centraliza todos os logs relacionados.

Documentação: [Logs personalizados no NestJS](https://docs.nestjs.com/techniques/logger#injecting-a-custom-logger)

10. **Paginação**
Como a lista de produtos e de favoritos pode crescer indefinidamente, eu adicionei uma paginação simples (com page e limit). Essa solução é mais simples que implementar por cursor ou por cache. Com isso, eu diminuo a quantidade de dados que chegam na resposta.

Além disso, todos os endpoints que possuem paginação trazem esses dados de forma envelopada, dentro de um metadata.

11. **Error Handling**
Eu customizei o tratamento de erros com uma classe customizada, para ir além de console logs. Dessa forma, todas as mensagens de erro são padronizadas.

12. **Versionamento**
Todos os endpoints estão versionados, de forma que mudanças futuras não quebrem stakeholders.

13. **Pull Request**
Eu gerei branches a partir da main e ao final de cada tarefa eu fiz uma pull request com uma documentação sobre. Cada uma possui detalhes como:
- Critérios de aceite
- Cenários de teste
- Documentação

É possível acompanhar dentro do repositório.

</details>

---

<details>
<summary><b>Desafios Enfrentados</b></summary>
- Eu comecei implementando testes e2e para os controllers, mas eles falharam ao adicionar os guards de autenticação e autorização, pois os hashes e tokens gerados não combinavam
- A autenticação estava se relacionando com o customer e não com identity, fazendo os endpoints retornarem sempre 403
- Inicialmente a parte de favorites estava no mesmo contexto que customers, mas eu decidi separar pois eles tinham razões diferentes para crescerem, sendo necessário separá-los via refatoração

</details>

---

<details>
<summary><b>Lições Aprendidas</b></summary>

- Criar logs padronizados
- Monolito modular facilitou o crescimento do código

</details>

---

<details>
<summary><b>Melhorias Futuras</b></summary>

- Esteira de CI/CD
- Adicionar cache nos endpoints de consulta mais utilizados
- Interceptor para o traceId, para receber dados de sistemas de observabilidade (Datadog, Kibana, etc)
- Adicionar índices nas tabelas, para aumentar performance das queries de consulta
- Adição de API Gateway e Load Balancer para escalabilidade

</details>

---
