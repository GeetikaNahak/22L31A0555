const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_BACKEND_PACKAGES = [
  "cache", "controller", "cronjob", "db", "domain",
  "handler", "repository", "route", "service"
];
const VALID_FRONTEND_PACKAGES = [
  "api", "component", "hook", "page", "state", "style"
];
const VALID_SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];

export function validateLog({ stack, level, pkg }) {
  if (!VALID_STACKS.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!VALID_LEVELS.includes(level)) throw new Error(`Invalid level: ${level}`);

  const validPackages =
    stack === "backend"
      ? [...VALID_BACKEND_PACKAGES, ...VALID_SHARED_PACKAGES]
      : [...VALID_FRONTEND_PACKAGES, ...VALID_SHARED_PACKAGES];

  if (!validPackages.includes(pkg)) {
    throw new Error(`Invalid package: ${pkg} for stack: ${stack}`);
  }
}
