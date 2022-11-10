import { Request, Response, NextFunction } from "express";
import axios from "axios";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const DISABLE_RECAPTCHA = process.env.DISABLE_RECAPTCHA === "true";

export default async function recaptchaV3(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (DISABLE_RECAPTCHA) {
    return next();
  }

  if (!RECAPTCHA_SECRET_KEY) {
    return res.status(500).json({ error: "RECAPTCHA_SECRET_KEY is not set" });
  }

  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "recaptchaToken is not set" });
  }

  const remoteip = req.socket.remoteAddress;

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}&remoteip=${remoteip}`
  );

  const data = response.data;

  if (data.success) {
    res.locals.recaptcha = data;
    return next();
  }

  return res.status(400).json({ error: "recaptcha failed" });
}
