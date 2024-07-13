import Express from "express";
import mongoose from "mongoose";
import { Dish } from "./db"; // Ensure this is correctly imported
import dotenv from "dotenv";
import seedDB from "./seed";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/", {})
  .then(() => {
    console.log("Connected to MongoDB");
    // seedDB(); // Uncomment if you need to seed the database
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

var corsOptions = {
  origin: "http://localhost:5173", // Add your development front-end URL here
  methods: ["GET", "POST"], // Add other methods if needed
  allowedHeaders: ["Content-Type", "Authorization"], // Add other headers if needed
  credentials: true, // Enable credentials if needed
};
const app = Express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(Express.json());

app.get("/getList", async (req, res) => {
  try {
    const dishesDoc = await Dish.find();
    res.status(200).json({
      data: dishesDoc,
    });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

app.post("/togglePublish/:id", async (req, res) => {
  const { value } = req.body;
  console.log(req.body);
  console.log(value);
  const { id } = req.params;

  try {
    const dishDoc = await Dish.findOneAndUpdate(
      { dishId: Number(id) },
      { isPublished: value },
      { returnDocument: "after" }
    );
    io.emit("dishUpdated", dishDoc); // Broadcast update to all clients
    res.status(200).json({
      dishDoc,
    });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Running the backend");
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
