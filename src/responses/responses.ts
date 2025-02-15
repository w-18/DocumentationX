import { NextResponse } from "next/server";

export const notAuthorized = () => NextResponse.json({error: "You have to login to perform this action!"}, {status: 401})
export const invalidCaptcha = () => NextResponse.json({error: "Invalid captcha. Try again!"}, {status: 400})
export const missingPayload = () => NextResponse.json({error: "Missing payload!"}, {status: 400})
export const errorPage = ({ title, body }: { title: string; body: string }) =>
    new NextResponse(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error: ${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div class="container mx-auto px-4 py-12 max-w-4xl">
          <div class="mb-8 text-center">
              <h1 class="text-3xl font-bold text-red-500 mb-2 animate-pulse">
                  ⚠️ ${title}
              </h1>
              <p class="text-slate-400">Error details</p>
          </div>
  
          <div class="space-y-6">
              <div class="bg-red-500/10 p-6 rounded-xl border-l-4 border-red-500 transform transition-all hover:scale-[1.02]">
                  <div class="flex items-start gap-4">
                      <svg class="w-8 h-8 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                      <div>
                          <h3 class="text-xl font-semibold text-red-400 mb-2">Error Description</h3>
                          <p class="text-red-200">${body}</p>
                          <div class="mt-3 text-sm text-red-400/80">Error occurred at: ${new Date().toUTCString()}</div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="mt-8 text-center">
              <p class="text-slate-500 text-sm">Need help? <a href="mailto:support@example.com" class="text-blue-400 hover:underline">Contact support</a></p>
          </div>
      </div>
  </body>
  </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
  export const jsonError = (error: string) => NextResponse.json({error: `An error has occured: ${error}`})