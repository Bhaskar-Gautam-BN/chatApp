import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoute from "./src/routes/chatRoute.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";


dotenv.config();
connectDB();
const app = express();
app.use(express.json());
const port = 3000;

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`listening on port ${port}`);

});
