import axios from "axios";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

export default async function getGithubUserInfo(code: string) {
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      new URLSearchParams({
        client_id: GITHUB_CLIENT_ID || "",
        client_secret: GITHUB_CLIENT_SECRET || "",
        code: code,
        redirect_uri: GITHUB_REDIRECT_URI || "",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error("GitHub OAuth: No access token returned");
      throw new Error("No access token returned from GitHub");
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return userResponse.data;
  } catch (error) {
    console.error("Error in GitHub Authorization Flow:", error);
    throw error;
  }
}
