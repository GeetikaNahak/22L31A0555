import axios from "axios";
import { validateLog } from "./validator.js";
import dotenv from "dotenv";
dotenv.config();

const LOG_API = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnZWV0aWthbmFoYWtAZ21haWwuY29tIiwiZXhwIjoxNzU2OTY4OTkwLCJpYXQiOjE3NTY5NjgwOTAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI5MjI4MDhjYi1hNzFiLTQ0ZDUtOGFlNS02ZjhiZWYxYmJiNjEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJnZWV0aWthIG5haGFrIiwic3ViIjoiMjM3YTMzMWMtYTlhYy00Mzk3LThlYTQtNDg0NWYyMzM4ZjlhIn0sImVtYWlsIjoiZ2VldGlrYW5haGFrQGdtYWlsLmNvbSIsIm5hbWUiOiJnZWV0aWthIG5haGFrIiwicm9sbE5vIjoiMjJsMzFhMDU1NSIsImFjY2Vzc0NvZGUiOiJZenVKZVUiLCJjbGllbnRJRCI6IjIzN2EzMzFjLWE5YWMtNDM5Ny04ZWE0LTQ4NDVmMjMzOGY5YSIsImNsaWVudFNlY3JldCI6InVockNRdVdHRHZXV25Vd2sifQ.lHODWBnQLKrBpdOkqaC5BfkRNdfe8ia3rpwzN0Xdv3U";

export async function createLogger({ stack, level, pkg, message }) {
  try {
    validateLog({ stack, level, pkg });

    const res = await axios.post(
      LOG_API,
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Logging failed:", err.message);
    return { error: err.message };
  }
}

export function loggingMiddleware(stack, pkg) {
  return async (req, res, next) => {
    res.on("finish", async () => {
      await createLogger({
        stack,
        pkg,
        level: "info",
        message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
      });
    });
    next();
  };
}
