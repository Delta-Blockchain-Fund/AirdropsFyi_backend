import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./router";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
});

// the middleware for parsing the body of the request
app.use(express.json());

// the middleware for allowing cross-origin requests
app.use(cors());

// the global rate limiter
app.use(limiter);

// the router
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
