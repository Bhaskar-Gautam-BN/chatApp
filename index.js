import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoute from "./src/routes/chatRoute.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import http from "http";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { initializeSocket } from "./socket.js";
import { Server } from "socket.io";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
const server = http.createServer(app);
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// initializeSocket(server);

const port = 3001;
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res,
    (err) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      const token = socket.request.cookies.token;
      if (!token) return next(new Error("Authentication error"));
      const decode =jwt.verify(
        token,
        process.env.SECRET_KEY,
      )
      next();
    }
  )
});
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);
  // socket.broadcast.emit("welcome", `Welcome to the server ${socket.id}`);
  // socket.emit("welcome", `Welcome to the server ${socket.id}`);
  socket.on("message", (data) => {
    console.log(data);
    io.to(data.room).emit("received-message", data);
  })

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    // socket.broadcast.emit("bye", `Goodbye ${socket.id}`);
  });
});

// app.get("/index", (req, res) => {
//   console.log(__dirname);
//   res.sendFile(__dirname + "/index.html");
// });
app.get("/", (req, res) => {
  res.send(`
  <div style="display:flex; align-item:center; height:100vh; width:100%; justify-content:center; background:black; color:white;">
   <div>
     <h1>Chat App</h1>
    <p>Welcome to Server</p>
   </div>
  </div>
  `);
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);

app.use(notFound);
app.use(errorHandler);
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
