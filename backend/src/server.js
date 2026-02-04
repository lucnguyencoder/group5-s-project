//done
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { consola } = require("consola");
const { connectDB, syncDB } = require("./config/db.js");
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { initializeDefaultData } = require('./models');
const http = require('http');

dotenv.config();

const app = express();

const cors_options = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3004",
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(cors_options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'yami2'));

connectDB()
  .then(() => {
    return syncDB(false, false);
  })
  .then(() => {
    consola.success("[DB] Synchronized successfully.");
    return initializeDefaultData();
  })
  .then(() => {
    consola.success("[DB] Init completed.");
  })
  .catch(err => {
    consola.error("[DB] Init error:", err);
    process.exit(1);
  });

app.use('/', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  consola.info(`Running Project Yami on port ${PORT}`);
});