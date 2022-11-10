import { Token } from '../database';
import { Request, Response } from 'express';

async function checkNewTokens(req: Request, res: Response) {
  console.log(req);
  const { tokensNames } = req.body;

  if (!Array.isArray(tokensNames)) {
    return res.status(400).json({ error: 'tokensNames must be an array of strings' });
    return;
  }

  const allTokensNames = (
    await Token.findAll({
      attributes: ['name'],
    })
  ).map((token) => token.get('name'));

  const newTokensNames = tokensNames.filter((tokenName) => !allTokensNames.includes(tokenName));
  return res.json({ newTokensNames });
}

export default checkNewTokens;
