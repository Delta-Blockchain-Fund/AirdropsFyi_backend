import { Token, Wallet, WalletToken } from "../database";
import { Request, Response, Router } from "express";
import { Op } from "sequelize";

const CACHE_EXPIRATION = parseInt(process.env.CACHE_EXPIRATION || "60"); // in seconds

const infoRouter = Router();

let cache = {
  emailSent: 0,
  airdropsRegistered: 0,
  subscribers: 0,
};
let cacheExpiration = 0; // seconds since epoch

const updateCache = async () => {
  console.log("Updating cache");

  // email sent -> count all walletTokens which emailNotified is true
  const emailSent = await WalletToken.count({ where: { emailNotified: true } });
  // UPDATE wallet_tokens SET emailNotified = true WHERE emailNotified = false;
  // airdrops registered -> count all tokens
  const airdropsRegistered = await Token.count();
  // subscribers -> count all wallets which email is not null
  const subscribers = await Wallet.count({
    where: { email: { [Op.ne]: null } },
  });

  cache = {
    emailSent,
    airdropsRegistered,
    subscribers,
  };

  cacheExpiration = Math.floor(Date.now() / 1000) + CACHE_EXPIRATION;
};

const getCache = async () => {
  if (cacheExpiration < Math.floor(Date.now() / 1000)) {
    await updateCache();
  }
  return cache;
};

infoRouter.get("/email-sent", async (req: Request, res: Response) => {
  const { emailSent } = await getCache();
  return res.json({ emailSent });
});

infoRouter.get("/airdrops-registered", async (req: Request, res: Response) => {
  const { airdropsRegistered } = await getCache();
  return res.json({ airdropsRegistered });
});

infoRouter.get("/subscribers", async (req: Request, res: Response) => {
  const { subscribers } = await getCache();
  return res.json({ subscribers });
});

infoRouter.get("/", async (req: Request, res: Response) => {
  const { emailSent, airdropsRegistered, subscribers } = await getCache();
  return res.json({ emailSent, airdropsRegistered, subscribers });
});

infoRouter.get("/gallery-items", async (req: Request, res: Response) => {
  const { emailSent, airdropsRegistered, subscribers } = await getCache();
  return res.json([
    {
      image: "/iconEmails.svg",
      title: formatNumber(emailSent),
      description: "Emails to subscribers",
    },
    {
      image: "/iconAirdrops.svg",
      title: formatNumber(airdropsRegistered),
      description: "Air Drops & NFTs",
    },
    {
      image: "/iconSubscribers.svg",
      title: formatNumber(subscribers),
      description: "Subscribers",
    },
  ]);
});

function formatNumber(number: number) {
  // 12345 -> 12,345
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default infoRouter;
