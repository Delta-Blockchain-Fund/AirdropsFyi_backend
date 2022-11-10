import { Request, Response } from "express";
import simpleGit from "simple-git";

const GITHUB_USER = process.env.GITHUB_USER as string;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL as string;
const GITHUB_EMAIL = process.env.GITHUB_EMAIL as string;

const organization_name = GITHUB_REPO_URL!.split("/")[1];
const repository_name = GITHUB_REPO_URL!.split("/")[2];

const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const github = new Octokit({
  auth: GITHUB_TOKEN,
});
const git = simpleGit();
const remote = `https://${GITHUB_USER}:${GITHUB_TOKEN}@${GITHUB_REPO_URL}`;

async function downloadRepo() {
  console.log("Downloading repo...");

  await git.raw(["config", "--global", "user.email", GITHUB_EMAIL]);
  await git.raw(["config", "--global", "user.name", GITHUB_USER]);

  if (fs.existsSync(path.join(__dirname, "../airdrops"))) {
    fs.rmdirSync(path.join(__dirname, "../airdrops"), { recursive: true });
  }

  await git.clone(remote, path.join(__dirname, "../airdrops"));
  await git.cwd(path.join(__dirname, "../airdrops"));
  await git.pull("origin", "main");

  console.log("Repo downloaded");
}

downloadRepo();

const submitNewTokenRoute = async (req: Request, res: Response) => {
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
  if (typeof addresses !== "object")
    return res.status(400).json({ error: "addresses must be an object" });

  // check addresses format
  for (const address in addresses) {
    if (typeof address !== "string")
      return res.status(400).json({ error: "address must be a string" });
    if (typeof addresses[address] !== "number")
      return res.status(400).json({ error: "amount must be a number" });
  }

  // check if addresses is not empty
  if (Object.keys(addresses).length === 0)
    return res.status(400).json({ error: "addresses must not be empty" });

  // create a new branch called "add_token_{name}"
  // create a new file called "{name}.json" in the "airdrops" folder
  // inside the airdrops repository
  // create a commit with the message "Add "{name}" token"
  // create a pull request with the title "Add "{name}" token"

  const branchName = `add_token_${name.replaceAll(" ", "_")}`;
  // replace all . and / in the file name to prevent injections
  const fileName = `${name.replaceAll(".", "_").replaceAll("/", "_")}.json`;
  const commitMessage = `Add "${name}" token`;
  const pullRequestTitle = `Add "${name}" token`;
  const pullRequestBody = `# Airdrop Description
${description}

# Token Logo
![Token Logo](${logoUrl})

# Token Symbol
${symbol}
`;

  try {
    await git.cwd(path.join(__dirname, "../airdrops"));
    await git.checkoutLocalBranch(branchName);
    fs.writeFileSync(
      path.join(__dirname, `../airdrops/airdrops/${fileName}`),
      JSON.stringify(
        {
          description,
          logoUrl,
          claimUrl,
          symbol,
          addresses,
        },
        null,
        2
      )
    );
    await git.add(path.join(__dirname, `../airdrops/airdrops/${fileName}`));
    await git.commit(commitMessage);
    await git.push("origin", branchName);

    const { data: pullRequest } = await github.pulls.create({
      owner: organization_name,
      repo: repository_name,
      title: pullRequestTitle,
      head: branchName,
      base: "main",
      body: pullRequestBody,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .json({ error: "Invalid request, check if the token already exists" });
  }
  return res.json({ message: "Pull request created" });
};

export default submitNewTokenRoute;
