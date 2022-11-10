import { Token, Wallet, WalletToken } from "../database";
import { Request, Response } from "express";
import notifyWallet from "../email/notifyWallet";

async function addNewToken(req: Request, res: Response) {
  const { name, description, logoUrl, claimUrl, symbol, addresses } = req.body;

  // check parameters
  if (typeof name !== "string")
    return res.status(400).json({ error: "name must be a string" });
  if (typeof description !== "string")
    return res.status(400).json({ error: "description must be a string" });
  if (typeof logoUrl !== "string")
    return res.status(400).json({ error: "logoUrl must be a string" });
  if (typeof claimUrl !== "string")
    return res.status(400).json({ error: "claimUrl must be a string" });
  if (typeof symbol !== "string")
    return res.status(400).json({ error: "symbol must be a string" });

  // check if addresses is a object of <address: amount>
  if (typeof addresses !== "object")
    return res.status(400).json({ error: "addresses must be an object" });
  for (const address in addresses) {
    if (typeof address !== "string")
      return res.status(400).json({ error: "address must be a string" });
    if (typeof addresses[address] !== "number")
      return res.status(400).json({ error: "amount must be a number" });
  }

  // check if token already exists
  const tokenCheck = await Token.findOne({ where: { name } });
  if (tokenCheck)
    return res
      .status(400)
      .json({ error: "token with this name already exists" });

  // create the token
  const token = await Token.create({
    name,
    description,
    logoUrl,
    claimUrl,
    symbol,
  });

  // create the wallets that don't exist yet
  const wallets: Wallet[] = [];
  for (const address in addresses) {
    const [wallet, created] = await Wallet.findOrCreate({
      where: { address },
    });
    if (created) {
      console.log(`Wallet ${address} created`);
    }
    wallets.push(wallet);
  }

  // create the walletTokens
  const walletTokens: WalletToken[] = [];
  for (const wallet of wallets) {
    const walletToken = await WalletToken.create({
      walletAddress: wallet.get("address"),
      tokenName: token.get("name"),
      amount: addresses[wallet.get("address")],
      emailNotified: false,
    });
    walletTokens.push(walletToken);
  }

  // notify the wallets
  for (const walletToken of walletTokens) {
    await notifyWallet(walletToken);
  }

  return res.json({ token, wallets, walletTokens });
}

export default addNewToken;
