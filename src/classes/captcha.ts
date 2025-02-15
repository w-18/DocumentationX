
type CaptchaConstructorInput = {
    siteKey: string;
    secretKey: string;
}
export class Captcha {
    siteKey: string;
    secretKey: string;
    public constructor ({siteKey, secretKey}: CaptchaConstructorInput) {
        this.siteKey = siteKey;
        this.secretKey = secretKey;
    }

    public async verify (captchaResponse: string, remoteIp: string) {
         const verificationUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        const formData = new FormData()
        formData.append("secret", this.secretKey);
        formData.append("response", captchaResponse);
        formData.append("remoteIp", remoteIp)
         const results = await fetch(verificationUrl, {
            body: formData,
            method: "POST"
         });

         const outcome = await results.json();

         if(outcome.success) return true;
         else return false;
    }
}