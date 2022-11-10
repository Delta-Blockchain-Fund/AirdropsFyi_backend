import { Wallet } from "../database";
import { Request, Response } from "express";

async function walletRoute(req: Request, res: Response) {
  const { address } = req.params;
  const wallet = await Wallet.findOne({
    where: { address },
    attributes: ["address", "email"],
  });
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }
  return res.json(wallet);
}

export default walletRoute;
