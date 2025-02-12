import { NextRequest, NextResponse } from "next/server";

const urls = new Map<string, string>([
  ["google", "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=191836291016-9ja6isdecnahld4918eein663gq4gknu.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Fdev.docx.w18.one%2Fapi%2Fv1%2Fauth%2Fcallback%3Fservice%3Dgoogle&response_type=code&access_type=offline&scope=openid%20profile&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow"],
  ["github", "https://github.com/login/oauth/authorize?client_id=Ov23liWLJjbtctCUH1yr&scope=read%3Auser"],
  ["discord", "https://discord.com/oauth2/authorize?client_id=1337841762508734585&response_type=code&redirect_uri=http%3A%2F%2Fdev.docx.w18.one%2Fapi%2Fv1%2Fauth%2Fcallback%3Fservice%3Ddiscord&scope=identify"],
]);

export function GET(req: NextRequest) {
  const service = req.nextUrl.searchParams.get("service");

  if (!service || !urls.has(service)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  const redirectUrl = urls.get(service);
  if (redirectUrl) {
    return NextResponse.redirect(new URL(redirectUrl));
  }

  return NextResponse.redirect(new URL("/", req.nextUrl.origin));
}
