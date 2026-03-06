# Order API

API RESTful para gerenciamento de pedidos, desenvolvida em Node.js com Express e MongoDB.
Inclui autenticacao JWT e documentacao interativa com Swagger.

## Sumario

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalacao e Configuracao](#instalacao-e-configuracao)
- [Documentacao Swagger](#documentacao-swagger)
- [Autenticacao (JWT)](#autenticacao-jwt)
- [Endpoints de Pedidos](#endpoints-de-pedidos)
- [Transformacao de Dados](#transformacao-de-dados)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)

---

## Tecnologias

- Node.js
- Express 4.18
- Mongoose 7.4
- MongoDB
- jsonwebtoken (JWT) & bcryptjs
- swagger-jsdoc & swagger-ui-express
- dotenv

## Estrutura do Projeto

```
order-api/
├── config/
│   ├── database.js          # Conexao com o MongoDB
│   └── swagger.js           # Configuracao do Swagger
├── controllers/
│   ├── authController.js    # Logica de registro e login
│   └── orderController.js   # Logica de negocio de pedidos
├── middlewares/
│   └── authMiddleware.js    # Protecao de rotas via JWT
├── models/
│   ├── Order.js             # Schema de Pedidos
│   └── User.js              # Schema de Usuarios
├── routes/
│   ├── authRoutes.js        # Rotas de autenticacao
│   └── orderRoutes.js       # Rotas de pedidos
├── .env
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

O arquivo `.env` ja vem configurado com os valores padrao (crie-o se nao existir):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/order_db
JWT_SECRET=sua_chave_secreta_aqui
```

### 4. Iniciar o MongoDB

Com Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 5. Rodar a aplicacao

Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

O servidor estara disponivel em `http://localhost:3000`.

---

## Documentacao Swagger

A API e totalmente documentada usando Swagger. Quando o servidor estiver rodando, acesse a documentacao interativa em:

👉 **http://localhost:3000/api-docs**

Pelo Swagger UI, voce pode testar todos os endpoints, ver os schemas de requisicao e resposta, e autenticar-se (botão "Authorize") fornecendo seu token JWT para testar rotas protegidas.

---

## Autenticacao (JWT)

A API utiliza tokens JWT para proteger os endpoints de gerenciamento de pedidos.
E necessario criar um usuario, fazer login para obter um token, e envia-lo no header `Authorization` nas requisiçoes subsequentes:
`Authorization: Bearer <seu_token_jwt>`

### Registrar Usuario

```
POST http://localhost:3000/auth/register
Content-Type: application/json
```

Body:
```json
{
  "username": "admin",
  "password": "senhaSegura123"
}
```

Resposta (201 Created):
```json
{
  "_id": "64daba7d...",
  "username": "admin",
  "token": "eyJhbG..."
}
```

### Login

```
POST http://localhost:3000/auth/login
Content-Type: application/json
```

Body e o mesmo do registro. Sucesso retorna 200 OK com os dados do usuario e o token.

---

## Endpoints de Pedidos

Todos os endpoints abaixo exigem o header de autenticacao (`Authorization: Bearer <token>`).

### Criar Pedido
`POST /order`
Cria um novo pedido validando duplicidade (erro 400 se `numeroPedido` ja existir).

### Listar Todos os Pedidos
`GET /order/list`
Retorna array contendo todos os pedidos registrados.

### Buscar Pedido por ID
`GET /order/:orderId`
Retorna dados de um pedido especifico usando seu orderId (retorna 404 se nao existir).

### Atualizar Pedido
`PUT /order/:orderId`
Atualiza dados usando o numero do pedido passsado na URL. Body igual o da criacao. 

### Deletar Pedido
`DELETE /order/:orderId`
Deleta um pedido de acordo com o id da URL.

*(Veja o arquivo [Swagger UI](http://localhost:3000/api-docs) paras payloads e retornos exatos).*

---

## Transformacao de Dados

A API recebe (via requisição externa) os dados com campos em portugues e salva no MongoDB com mapeamento para ingles:

| Campo recebido (request) | Campo salvo (banco) | Tipo   |
|--------------------------|---------------------|--------|
| `numeroPedido`           | `orderId`           | String |
| `valorTotal`             | `value`             | Number |
| `dataCriacao`            | `creationDate`      | Date   |
| `items[].idItem`         | `items[].productId` | Number |
| `items[].quantidadeItem` | `items[].quantity`  | Number |
| `items[].valorItem`      | `items[].price`     | Number |

---

## Estrutura do Banco de Dados

Aplicacao persistida no MongoDB usando a collection `orders` contendo um subdocumento (items).

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
O schema `Order` conta com um index no campo `orderId`, assegurando singularidade.
O schema `User` persiste usuarios criados, com senhas hasheadas pelo `bcryptjs`.
