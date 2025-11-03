import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'

import bookRoutes from './routes/bookRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT) || 3000;
const APP_URL = process.env.APP_URL || `http://localhost`;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.use("/api/books", bookRoutes);
app.use("/api/statistics", statisticsRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: err?.message });
});