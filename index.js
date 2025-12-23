import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mailRoute from "./sendMail.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mail Sending Route (ZeptoMail)
app.use("/send-mail", mailRoute);

app.get("/", (req, res) => {
  res.send("✅ Backend Running Successfully!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server started on PORT ${PORT}`);
  console.log(`📧 Mail API available at http://localhost:${PORT}/send-mail`);
});