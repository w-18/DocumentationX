import { fetchUser } from "@/handlers/users"
import jwt from "jsonwebtoken"

export default async function func(jwtPayload: string): Promise<unknown | null> {
try {
            const userid = (jwt.verify(jwtPayload, process.env.SESSION_JWT_TOKEN!) as {userId: string}).userId!
            const user = await fetchUser(userid)
            return user
} catch {
    return {}
}
}