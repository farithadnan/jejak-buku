import path from 'path';
import dotenv from 'dotenv';
import express from 'express';

import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const APP_URL = process.env.APP_URL || `http://localhost`;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${APP_URL}:${PORT}`);
});