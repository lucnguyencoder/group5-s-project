const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { consola } = require("consola");

// Import shared DB config and models from backend
// In a real microservices setup, you'd either:
// 1) Copy only the models/controllers/routes this service needs
// 2) Use a shared library/package for common code
// 3) Have separate databases per service (ultimate goal)

// For now, we symlink or copy from backend to keep logic identical
const { connectDB } = require("../backend/src/config/db.js");
const storeRoutes = require("../backend/src/routes/api/store/storeIndex");
const { errorHandler } = require("../backend/src/middleware/errorHandler");

dotenv.config();

const app = express();

const cors_options = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3004",
    "http://localhost:80",
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
    consola.success("[Store Service] DB connected.");
  })
  .catch(err => {
    consola.error("[Store Service] DB error:", err);
    process.exit(1);
  });

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ service: 'store-service', status: 'ok' });
});

// Mount only store routes at root (API gateway will handle /api/store prefix)
app.use('/', storeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  consola.info(`Store Service running on port ${PORT}`);
});
