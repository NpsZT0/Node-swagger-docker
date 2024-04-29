const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = http.createServer(app);



server.listen(port);