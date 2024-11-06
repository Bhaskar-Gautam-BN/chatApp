// Import the necessary modules
import { Server } from "socket.io";


let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    
    cors: {
      origin: "*", // Adjust the CORS settings as needed
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("customEvent", (data) => {
      console.log("Received data:", data);
      socket.emit("responseEvent", { message: "Hello from the server!" });
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

// Export the initialization function and the Socket.IO instance
 export const getIO= () => io;
