import { Wallet } from "../database";
import { Request, Response } from "express";

async function registerWalletRoute(req: Request, res: Response) {
  const { address, email } = req.body;

  const wallet = await Wallet.findOne({
    where: { address },
    attributes: ["address", "email"],
  });

  if (wallet && wallet.get("email")) {
    return res.status(400).json({ error: "Wallet already registered" });
  }

  const newWallet = await Wallet.findOrCreate({
    where: { address },
    defaults: { email },
  });

  await newWallet[0].update({ email });

  return res.json({ message: "Wallet registered successfully" });
}

export default registerWalletRoute;
