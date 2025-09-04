import axios from "axios";

const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_BACKEND_PACKAGES = [
  "cache", "controller", "cronjob", "db", "domain",
  "handler", "repository", "route", "service"
];
const VALID_FRONTEND_PACKAGES = [
  "api", "component", "hook", "page", "state", "style"
];
const VALID_COMMON_PACKAGES = ["auth", "config", "middleware", "utils"];

const LOG_API = "http://20.244.56.144/evaluation-service/logs";

export async function logEvent({ stack, level, pkg, message }) {
  try {
    
    if (!VALID_STACKS.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}`);
    }

    if (!VALID_LEVELS.includes(level)) {
      throw new Error(`Invalid level: ${level}`);
    }

    if (stack === "backend" && 
        ![...VALID_BACKEND_PACKAGES, ...VALID_COMMON_PACKAGES].includes(pkg)) {
      throw new Error(`Invalid backend package: ${pkg}`);
    }

    if (stack === "frontend" && 
        ![...VALID_FRONTEND_PACKAGES, ...VALID_COMMON_PACKAGES].includes(pkg)) {
      throw new Error(`Invalid frontend package: ${pkg}`);
    }

    const response = await axios.post(LOG_API, {
      stack,
      level,
      package: pkg,
      message,
    });

    return response.data; 
  } catch (error) {
    console.error("Logging failed:", error.message);
    return { error: error.message };
  }
}
