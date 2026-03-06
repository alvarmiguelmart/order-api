# Order API

API RESTful para gerenciamento de pedidos, desenvolvida em Node.js com Express e MongoDB.

## Sumario

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalacao e Configuracao](#instalacao-e-configuracao)
- [Endpoints](#endpoints)
  - [Criar Pedido](#criar-pedido)
  - [Buscar Pedido por ID](#buscar-pedido-por-id)
  - [Listar Todos os Pedidos](#listar-todos-os-pedidos)
  - [Atualizar Pedido](#atualizar-pedido)
  - [Deletar Pedido](#deletar-pedido)
- [Transformacao de Dados](#transformacao-de-dados)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)

---

## Tecnologias

- Node.js
- Express 4.18
- Mongoose 7.4
- MongoDB
- dotenv

## Estrutura do Projeto

```
order-api/
├── config/
│   └── database.js          # Conexao com o MongoDB
├── controllers/
│   └── orderController.js   # Logica de negocio e transformacao de dados
├── models/
│   └── Order.js             # Schema do Mongoose
├── routes/
│   └── orderRoutes.js       # Definicao das rotas
├── .env                     # Variaveis de ambiente
├── package.json
├── README.md
└── server.js                # Ponto de entrada da aplicacao
```

## Instalacao e Configuracao

### Pre-requisitos

- Node.js (v16 ou superior)
- MongoDB rodando localmente ou via Docker

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd order-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

O arquivo `.env` ja vem configurado com os valores padrao:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/order_db
```

Altere conforme necessario para seu ambiente.

### 4. Iniciar o MongoDB

Com Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

Ou inicie o servico do MongoDB localmente, de acordo com seu sistema operacional.

### 5. Rodar a aplicacao

Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

Modo producao:

```bash
npm start
```

O servidor estara disponivel em `http://localhost:3000`.

---

## Endpoints

### Criar Pedido

Cria um novo pedido no banco de dados. Caso ja exista um pedido com o mesmo `numeroPedido`, retorna erro 400.

```
POST http://localhost:3000/order
Content-Type: application/json
```

Body:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

Resposta (201 Created):

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000,
      "_id": "64daba7d05bcc674899dc5bf"
    }
  ],
  "_id": "64dab8a0f6b7183237d307f6",
  "__v": 0
}
```

Resposta caso o pedido ja exista (400 Bad Request):

```json
{
  "message": "Pedido ja existe"
}
```

---

### Buscar Pedido por ID

Retorna os dados de um pedido especifico pelo numero do pedido.

```
GET http://localhost:3000/order/:orderId
```

Exemplo:

```
GET http://localhost:3000/order/v10089015vdb-01
```

Resposta (200 OK):

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000,
      "_id": "64daba7d05bcc674899dc5bf"
    }
  ],
  "_id": "64dab8a0f6b7183237d307f6",
  "__v": 0
}
```

Resposta caso nao encontrado (404 Not Found):

```json
{
  "message": "Pedido nao encontrado"
}
```

---

### Listar Todos os Pedidos

Retorna um array com todos os pedidos cadastrados.

```
GET http://localhost:3000/order/list
```

Resposta (200 OK):

```json
[
  {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 1,
        "price": 1000,
        "_id": "64daba7d05bcc674899dc5bf"
      }
    ],
    "_id": "64dab8a0f6b7183237d307f6",
    "__v": 0
  }
]
```

---

### Atualizar Pedido

Atualiza os dados de um pedido existente. O corpo da requisicao segue o mesmo formato da criacao.

```
PUT http://localhost:3000/order/:orderId
Content-Type: application/json
```

Exemplo:

```
PUT http://localhost:3000/order/v10089015vdb-01
```

Body:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}
```

Resposta (200 OK): retorna o pedido atualizado.

Resposta caso nao encontrado (404 Not Found):

```json
{
  "message": "Pedido nao encontrado"
}
```

---

### Deletar Pedido

Remove um pedido do banco de dados pelo numero do pedido.

```
DELETE http://localhost:3000/order/:orderId
```

Exemplo:

```
DELETE http://localhost:3000/order/v10089015vdb-01
```

Resposta (200 OK):

```json
{
  "message": "Pedido deletado com sucesso"
}
```

Resposta caso nao encontrado (404 Not Found):

```json
{
  "message": "Pedido nao encontrado"
}
```

---

## Transformacao de Dados

A API recebe os dados no formato original (campos em portugues) e realiza um mapeamento para o formato interno antes de salvar no banco. A tabela abaixo mostra a correspondencia:

| Campo recebido (request) | Campo salvo (banco) | Tipo   |
|--------------------------|---------------------|--------|
| `numeroPedido`           | `orderId`           | String |
| `valorTotal`             | `value`             | Number |
| `dataCriacao`            | `creationDate`      | Date   |
| `items[].idItem`         | `items[].productId` | Number |
| `items[].quantidadeItem` | `items[].quantity`  | Number |
| `items[].valorItem`      | `items[].price`     | Number |

Essa transformacao e feita pela funcao `transformData()` em `controllers/orderController.js`.

## Estrutura do Banco de Dados

A aplicacao utiliza MongoDB com uma unica collection chamada `orders`. Cada documento possui a seguinte estrutura:

```json
{
  "_id": "ObjectId",
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "ISODate(2023-07-19T12:24:11.529Z)",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000,
      "_id": "ObjectId"
    }
  ],
  "__v": 0
}
```

O campo `orderId` possui indice unico, garantindo que nao existam pedidos duplicados.

---

## Codigos de Resposta HTTP

| Codigo | Significado           | Quando ocorre                          |
|--------|-----------------------|----------------------------------------|
| 200    | OK                    | Busca, listagem, atualizacao e delecao |
| 201    | Created               | Pedido criado com sucesso              |
| 400    | Bad Request           | Pedido ja existe no banco              |
| 404    | Not Found             | Pedido nao encontrado                  |
| 500    | Internal Server Error | Erro interno do servidor               |
