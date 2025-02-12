import { NextRequest, NextResponse } from "next/server";
import getSession from "@/functions/session";

export function GET(req: NextRequest) {
    const user = getSession(req.cookies.get("session")?.value || "");
    const response = new NextResponse(
        `<html>
            <head>
                <meta http-equiv="refresh" content="0; url=/" />
                <script>window.location.reload(true);window.location.href="/"</script>
                
            </head>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
    );

    if (!user) return response;
    
    response.cookies.delete("session");
    return response;
}
