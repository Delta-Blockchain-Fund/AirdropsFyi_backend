import { Feedback } from "../database";
import { Request, Response, Router } from "express";
import isAdmin from "../middlewares/isAdmin";

const feedbackRouter = Router();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

feedbackRouter.get("/", isAdmin, async (req: Request, res: Response) => {
  const allFeedback = await Feedback.findAll();
  return res.json(allFeedback);
});

feedbackRouter.post("/", async (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  console.log(rating, comment);

  if (!rating || !comment) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newFeedback = await Feedback.create({
    rating,
    comment,
  });

  const msg = {
    to: process.env.FEEDBACK_EMAIL_RECIPIENT,
    from: process.env.SENDGRID_EMAIL,
    subject: "New feedback",
    text: `Rating: ${rating}

Comment: ${comment}`,
  };

  console.log(msg);

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: any) => {
      console.error(error);
    });

  return res.status(200).json({ message: "Feedback sent" });
});

export default feedbackRouter;
