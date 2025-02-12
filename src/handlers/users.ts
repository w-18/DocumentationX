import { ExistingUser, Users } from "@/classes/user";

export const users = new Users()
export const fetchUser = async (id: string) => (await ExistingUser.fetch(id))