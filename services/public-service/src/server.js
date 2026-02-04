const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { consola } = require("consola");

// Import shared DB config and routes from backend
const { connectDB } = require("../backend/src/config/db.js");
const publicRoutes = require("../backend/src/routes/api/publicIndex");
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
    consola.success("[Public Service] DB connected.");
  })
  .catch(err => {
    consola.error("[Public Service] DB error:", err);
    process.exit(1);
  });

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ service: 'public-service', status: 'ok' });
});

// Mount public routes at root (API gateway will handle /api prefix)
app.use('/', publicRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  consola.info(`Public Service running on port ${PORT}`);
});
