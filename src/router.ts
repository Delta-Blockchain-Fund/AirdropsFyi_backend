import express from "express";

import checkNewTokensRoute from "./routes/checkNewTokens";
import addNewTokenRoute from "./routes/addNewToken";
import airdropsRoute from "./routes/airdrops";
import registerWalletRoute from "./routes/registerWallet";
import submitNewTokenRoute from "./routes/submitNewToken";
import infoRouter from "./routes/infoRouter";
import feedbackRouter from "./routes/feedback";

import walletRoute from "./routes/wallet";
import isAdmin from "./middlewares/isAdmin";
import recaptchaV3 from "./middlewares/recaptchaV3";

const router = express.Router();

router.get("/", isAdmin, (req, res) => {
  return res.json({ message: "Hello World" });
});

// Github actions send all tokens names to check what is new
router.post("/check-new-tokens", isAdmin, checkNewTokensRoute);

// Github actions send new tokens one by one to add them to the database
router.post("/add-new-token", isAdmin, addNewTokenRoute);

// frontend searches for all airdrops for a wallet
router.get("/airdrops/:address", airdropsRoute);

// frontend registers a wallet to receive email notifications
router.post("/register-wallet", recaptchaV3, registerWalletRoute);

// frontend get wallet email
router.get("/wallet/:address", walletRoute);

// frontend submits a new token to create a pull request in the airdrops repository
router.post("/submit-new-token", recaptchaV3, submitNewTokenRoute);

// frontend sends feedback about the website
router.use("/feedback", feedbackRouter);

// frontend gets general information of the application
router.use("/info", infoRouter);

export default router;
