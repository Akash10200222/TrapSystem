import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import countRoutes from "./routes/count.routes.js";


dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use("/api/count", countRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));


  app.get(/.*/, (_, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});