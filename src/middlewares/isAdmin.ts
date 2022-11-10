import { Request, Response, NextFunction } from "express";

const adminKey = process.env.ADMIN_KEY;

export default function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!adminKey) {
    return res.status(500).json({ error: "ADMIN_KEY is not set" });
  } else if (req.headers["x-admin-key"] === adminKey) {
    next();
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
