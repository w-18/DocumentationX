import { Captcha } from "@/classes/captcha";


export const captcha = new Captcha({siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!, secretKey: process.env.TURNSTILE_PRIVATE_KEY!});