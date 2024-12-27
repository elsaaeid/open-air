import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import openaiRoutes from "./routes/openaiRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/post", postRoutes);
app.use("/api/openai", openaiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({success: true});
});


const startServer = () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.BACKEND_URL}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
