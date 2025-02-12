import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sql from "@/connections/psql";
import bcrypt from "bcrypt";
import { fetchUser, users } from "@/handlers/users";
import getGithubUserInfo from "@/OAuth2-functions/github";
import getDiscordUserInfo from "@/OAuth2-functions/discord";
import getGoogleUserInfo from "@/OAuth2-functions/google";
import GenerateGoogleUsername from "@/functions/generate-google-username";

const invalidParametersResponse = NextResponse.json(
  { error: "Invalid parameters!" },
  { status: 400 }
);
const allowedServices = ["native-n", "native-r", "discord", "github", "google"];

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    if(searchParams.get("error")) return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_HOSTNAME + "/"))

    const service = searchParams.get("service");
    if (!service || !allowedServices.includes(service)) {
      return invalidParametersResponse;
    }

    switch (service) {
      // Native Registration – returns JSON response
      case "native-n": {
        const username = searchParams.get("username");
        const password = searchParams.get("password");

        if (!username || !password) {
          return invalidParametersResponse;
        }

        const isValidUsername = /^[a-zA-Z0-9_]{3,32}$/.test(username);
        if (!isValidUsername) {
          return NextResponse.json(
            { error: "Invalid username format!" },
            { status: 400 }
          );
        }

        const passhash = await bcrypt.hash(password, 10);
        const user = await users.create({
          username: username.toLowerCase(),
          authService: "native",
          authServiceUserId: "",
          passhash,
        });

        if (!user.success) {
          return NextResponse.json(user, { status: 400 });
        }

        const sessionToken = jwt.sign(
          { userId: user.userid },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        const response = NextResponse.json({ success: true });
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2, // 2 days
        });

        return response;
      }

      // Native Login – returns JSON response
      case "native-r": {
        const username = searchParams.get("username");
        const password = searchParams.get("password");

        if (!username || !password) {
          return invalidParametersResponse;
        }

        const isValidUsername = /^[a-zA-Z0-9_]{3,32}$/.test(username);
        if (!isValidUsername) {
          return NextResponse.json(
            { error: "Invalid username format!" },
            { status: 400 }
          );
        }

        const userCheck = await sql.query(
          `SELECT * FROM users WHERE username = $1`,
          [username.toLowerCase()]
        );

        if (userCheck.rowCount !== 1) {
          return NextResponse.json(
            { error: "Username not found!" },
            { status: 400 }
          );
        }

        const isPasswordMatch = await bcrypt.compare(
          password,
          userCheck.rows[0].passhash
        );
        if (!isPasswordMatch) {
          return NextResponse.json({ error: "No password match" }, { status: 400 });
        }

        const sessionToken = jwt.sign(
          { userId: userCheck.rows[0].id },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        const response = NextResponse.json({ success: true });
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2,
        });

        return response;
      }

      // GitHub OAuth – returns a redirect response on success
      case "github": {
        const authCode = searchParams.get("code");
        if (!authCode) return invalidParametersResponse;

        const githubUser = await getGithubUserInfo(authCode);
        const existsQuery = await sql.query(
          `SELECT * FROM users WHERE auth_service = 'github' AND auth_service_user_id = $1`,
          [githubUser.id]
        );
        const doesUserExist = existsQuery.rows[0];
        let userId;
        if (!doesUserExist) {
          userId = (await users.create({
            username: githubUser.login,
            authService: service,
            authServiceUserId: githubUser.id,
          })).userid;
        } else {
          const user = await fetchUser(doesUserExist.id);
          await user?.rename(githubUser.login);
          userId = doesUserExist.id;
        }

        const sessionToken = jwt.sign(
          { userId },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        // Redirecting on successful OAuth login
        const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_HOSTNAME + "/"))
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2,
        });

        return response;
      }

      // Discord OAuth – returns a redirect response on success
      case "discord": {
        const authCode = searchParams.get("code");
        if (!authCode) return invalidParametersResponse;

        const discordUser = await getDiscordUserInfo(authCode);
        const existsQuery = await sql.query(
          `SELECT * FROM users WHERE auth_service = 'discord' AND auth_service_user_id = $1`,
          [discordUser.id]
        );
        const doesUserExist = existsQuery.rows[0];
        let userId;
        if (!doesUserExist) {
          userId = (await users.create({
            username: discordUser.username,
            authService: service,
            authServiceUserId: discordUser.id,
          })).userid;
        } else {
          const user = await fetchUser(doesUserExist.id);
          await user?.rename(discordUser.username);
          userId = doesUserExist.id;
        }

        const sessionToken = jwt.sign(
          { userId },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        // Redirecting on successful OAuth login
        const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_HOSTNAME + "/"))
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2,
        });

        return response;
      }

      // Google OAuth – returns a redirect response on success
      case "google": {
        const authCode = searchParams.get("code");
        if (!authCode) return invalidParametersResponse;

        const googleAccount = await getGoogleUserInfo(authCode);
        const googleAccountUserId = googleAccount.sub;
        const googleAccountUsername = GenerateGoogleUsername();

        const existsQuery = await sql.query(
          `SELECT * FROM users WHERE auth_service = 'google' AND auth_service_user_id = $1`,
          [googleAccountUserId]
        );
        const doesUserExist = existsQuery.rows[0];
        let userId;
        if (!doesUserExist) {
          userId = (await users.create({
            username: googleAccountUsername,
            authService: service,
            authServiceUserId: googleAccountUserId,
          })).userid;
        } else {
          userId = doesUserExist.id;
        }

        const sessionToken = jwt.sign(
          { userId },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        // Redirecting on successful OAuth login
        const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_HOSTNAME + "/"))
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2,
        });

        return response;
      }

      default:
        return NextResponse.json(
          { error: "Invalid service" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "A generic error happened during authentication, try again later." },
      { status: 400 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const searchParams = await req.json().catch(() => {});

    const service = searchParams?.service;
    if (!service || !allowedServices.includes(service)) {
      return invalidParametersResponse;
    }

    switch (service) {
      // Native Registration – returns JSON response
      case "native-n": {
        const username = searchParams.u;
        const password = searchParams.p;

        if (!username || !password) {
          return invalidParametersResponse;
        }

        const isValidUsername = /^[a-zA-Z0-9_]{3,32}$/.test(username);
        if (!isValidUsername) {
          return NextResponse.json(
            { error: "Invalid username format!" },
            { status: 400 }
          );
        }

        const passhash = await bcrypt.hash(password, 10);
        const user = await users.create({
          username: username,
          authService: "native",
          authServiceUserId: "",
          passhash,
        });

        if (!user.success) {
          return NextResponse.json(user, { status: 400 });
        }

        const sessionToken = jwt.sign(
          { userId: user.userid },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        const response = NextResponse.json({ success: true });
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2, // 2 days
        });

        return response;
      }

      // Native Login – returns JSON response
      case "native-r": {
        const username = searchParams.u;
        const password = searchParams.p;

        if (!username || !password) {
          return invalidParametersResponse;
        }

        const isValidUsername = /^[a-zA-Z0-9_]{3,32}$/.test(username);
        if (!isValidUsername) {
          return NextResponse.json(
            { error: "Invalid username format!" },
            { status: 400 }
          );
        }

        const userCheck = await sql.query(
          `SELECT * FROM users WHERE username = $1`,
          [username]
        );

        if (userCheck.rowCount !== 1) {
          return NextResponse.json(
            { error: "Username not found!" },
            { status: 400 }
          );
        }

        const isPasswordMatch = await bcrypt.compare(
          password,
          userCheck.rows[0].passhash
        );
        if (!isPasswordMatch) {
          return NextResponse.json({ error: "No password match" }, { status: 400 });
        }
        console.log(userCheck.rows[0])
        const sessionToken = jwt.sign(
          { userId: userCheck.rows[0].id },
          process.env.SESSION_JWT_TOKEN!,
          { expiresIn: "2d" }
        );

        const response = NextResponse.json({ success: true });
        response.cookies.set("session", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 2, // 2 days
        });

        console.log(response)

        return response;
      }

      default:
        return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
