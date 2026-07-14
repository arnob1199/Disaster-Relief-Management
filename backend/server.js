require('dotenv').config();

const pool = require('./config/db');
const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const reliefRequestRoutes = require('./routes/reliefRequestRoutes');
const distributionRoutes = require('./routes/distributionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shelters', shelterRoutes);
app.use('/api/v1/supplies', supplyRoutes);
app.use('/api/v1/requests', reliefRequestRoutes);
app.use('/api/v1/distributions', distributionRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

let server;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    connection.release();

    server = app.listen(PORT, () => {
      console.log(`🚀 Disaster Relief API is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MySQL");
    console.error(err.message);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down server.`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
