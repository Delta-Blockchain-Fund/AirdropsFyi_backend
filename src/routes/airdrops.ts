import { Token, WalletToken, sequelize } from '../database';
import { Request, Response } from 'express';

async function airdropsRoute(req: Request, res: Response) {
  const { address } = req.params;
  const walletTokens = await WalletToken.findAll({
    where: sequelize.where(sequelize.fn('lower', sequelize.col('walletAddress')), sequelize.fn('lower', address)),
    attributes: ['walletAddress', 'amount'],
    include: [
      {
        model: Token,
        attributes: ['name', 'symbol', 'logoUrl', 'claimUrl'],
      },
    ],
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  });
  return res.json(walletTokens);
}

export default airdropsRoute;
