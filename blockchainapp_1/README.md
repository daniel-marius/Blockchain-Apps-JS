## Blockchain App Node/Express

## Features

- A proof of work algorithm to secure the network
- Hashing algorithms to secure the data within the blockchain
- The ability to mine (create) new blocks that contain data
- The ability to create transactions and store them in blocks
- A consensus algorithms to verify that the network nodes have valid data and are synchronized
- A broadcasting system to keep the data in the blockchain network synchronized
- P2P network based on HTTP endpoints
- AngularJS block explorer

## Available Scripts

Install the dependencies by running the following command:

```bash
npm install
```

Running the application:

```bash
# Run the first peer
npm run dev

# Run the second peer
HTTP_PORT=3002 HTTP_HOST=http://localhost:3002 npm run dev

# Run the third peer
HTTP_PORT=3003 HTTP_HOST=http://localhost:3003 npm run dev
```

Running the application using docker-compose:

```bash
docker-compose up --build
```

Shutdown docker-compose:

```bash
docker-compose down
```

Remove all containers, networks, images:

```bash
docker system prune
```
