import { Token, Wallet, WalletToken } from "../database";
import fs from "fs";

const htmlTemplate = fs.readFileSync(__dirname + "/index.html", "utf8");
const logoUrl = "https://i.ibb.co/prW4g1G/airdrop-Logo.png";
const deltaLogoUrl = "https://i.ibb.co/2vYrVGx/delta-Logo.png";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

async function notifyWallet(walletToken: WalletToken) {
  const wallet = await Wallet.findOne({
    where: { address: walletToken.get("walletAddress") },
  });
  const token = await Token.findOne({
    where: { name: walletToken.get("tokenName") },
  });

  if (!wallet || !token) {
    console.log("ERROR: wallet or token not found");
    return;
  }

  const email = wallet.get("email");
  if (!email) {
    console.log("Not sending email because no email is registered");
    return;
  }

  const subject = "Congratulations! You have received tokens!";

  const messageHtml = htmlTemplate
    .replace("{{amount}}", walletToken.get("amount").toString())
    .replace("{{symbol}}", token.get("symbol"))
    .replace("{{name}}", token.get("name"))
    .replace("{{claimUrl}}", token.get("claimUrl"))
    .replace("{{wallet}}", wallet.get("address"))
    .replace("http://localhost:3000/airdropLogo.svg", logoUrl)
    .replace("http://localhost:3000/deltaLogo.png", deltaLogoUrl);

  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    subject: subject,
    html: messageHtml,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: any) => {
      console.error(error);
    });

  await walletToken.update({ emailNotified: true });

  return;
}

export default notifyWallet;
