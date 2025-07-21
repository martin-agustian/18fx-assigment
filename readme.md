# 🍽️ Restaurant Microservice System

A microservice-based restaurant ordering system built with NestJS, RabbitMQ, MySQL, and Docker Compose.

## 📦 Services

| Service                | Description                                        |
|------------------------|----------------------------------------------------|
| order-service          | Handles food menu, order creation, and tracking   |
| kitchen-service        | Consumes orders and updates order status          |
| notification-service   | Sends email confirmation (simulated via logs)     |
| rabbitmq               | Message broker using fanout exchange              |
| mysql                  | Database for menus and orders                     |

## 🧰 Tech Stack

- Node.js 18 (NestJS)
- MySQL 8
- RabbitMQ (fanout exchange)
- Docker & Docker Compose
- TypeORM

## 🚀 Getting Started

1. **Clone the Repository**

```
git clone git@github.com:martin-agustian/18fx-assigment.git
cd 18fx-assigment
```

2. **Run the System with Docker Compose**

```
docker-compose down -v # Clean previous volumes (recommended)
docker-compose up --build
```

> This command will build all services and run the full system (MySQL, RabbitMQ, order, kitchen, notification) using a single docker-compose.yml file.

## 🔗 API Endpoints

### `GET /menu`

Fetch list of available food menu.

```
curl http://localhost:3000/menu
```

### `POST /order`

Create a new order.

Request body example:

```
{
  "customerEmail": "user@example.com",
  "items": [
    { "menuId": 1, "quantity": 2 },
    { "menuId": 2, "quantity": 1 }
  ]
}
```

Test with curl:

```
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{"customerEmail":"user@example.com","items":[{"menuId":1,"quantity":1}]}'
```

### `GET /order/:id`

Check order status by ID.

```
curl http://localhost:3000/order/1
```

## ⚙️ Message Flow

1. order-service saves order with status `Pending`
2. Publishes order to RabbitMQ fanout exchange `order_exchange`
3. notification-service receives from `order.confirmation` and logs "email sent"
4. kitchen-service receives from `order.process` and updates order to `Processed`

## 🛠 Architecture Overview

```
                +----------------------+
                |    order-service     |
                +----------------------+
                | REST API + RabbitMQ  |
                +----------+-----------+
                           |
                    fanout exchange
                   /                    \
        +----------v---------+   +-------v---------+
        |  kitchen-service   |   | notification-svc|
        +--------------------+   +-----------------+
        | update DB status   |   | log/send email  |
        +--------------------+   +-----------------+
```

## 🧪 Testing

- API: http://localhost:3000
- RabbitMQ UI: http://localhost:15672 (user: `guest`, pass: `guest`)
- MySQL: Auto-seeded with menu items

## 📁 Folder Structure

```
restaurant-system/
├── docker-compose.yml
├── order-service/
├── kitchen-service/
├── notification-service/
└── README.md
```

## 🔐 Environment Variables

Each service uses the following environment variables (via `.env` or `docker-compose.yml`):

```
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=18fx_assessment
RABBITMQ_URL=amqp://rabbitmq
```

## 📌 Notes

- Retry mechanism is implemented for RabbitMQ/MySQL connections
- Email delivery is simulated with console logs
- Fully cross-platform (Linux/Windows/macOS)
- Use `docker-compose down -v` to fully reset data
