import express from "express";
import express from "path";
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


app.use(history());
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
 });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server started on PORT ${PORT}`);
  console.log(`📧 Mail API available at http://localhost:${PORT}/send-mail`);
});