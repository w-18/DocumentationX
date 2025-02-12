import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { fetchUser } from "@/handlers/users";

export async function GET(req: NextRequest) {
try {
        const sessionCookie = req.cookies.get("session");
        if(!sessionCookie || !sessionCookie.value) return NextResponse.json({session: "none"})
    
            const userid = (jwt.verify(sessionCookie.value, process.env.SESSION_JWT_TOKEN!) as {userId: string}).userId!
            console.log(jwt.verify(sessionCookie.value, process.env.SESSION_JWT_TOKEN!))
            const user = await fetchUser(userid)
            return NextResponse.json({session: user})
} catch {
    return NextResponse.json({error: "An error occured trying to get your session."})
}
}