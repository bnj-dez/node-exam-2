import { isNotEmpty } from "../utils/isNotEmpty.js";

export const logger = (req, res, next) => {
  const method = req.method.toUpperCase();
  const path = req.path;
  const hostname = req.hostname;
  const query = isNotEmpty(req.query) ? JSON.stringify(req.query) : '';
  const body = isNotEmpty(req.body) ? JSON.stringify(req.body) : '';

  console.log(`${method} ${path} ${query} ${body} ${hostname}`);

  next();
}