import { fetchUser } from "@/handlers/users"
import jwt from "jsonwebtoken"


type ExistingUserType = {
    username: string;
    id: string;
    auth_service: "native" | "discord" | "github" | "google";
    auth_service_user_id: string | null;
    admin: boolean;
    premium: number;
    created_at: Date;
    pfp_url: string;
  }

export default async function func(jwtPayload: string): Promise<ExistingUserType | null> {
try {
            const userid = (jwt.verify(jwtPayload, process.env.SESSION_JWT_TOKEN!) as {userId: string}).userId!
            const user = await fetchUser(userid)
            return user as ExistingUserType | null
} catch {
    return null
}
}