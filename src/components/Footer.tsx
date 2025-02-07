"use client"

export default function Footer() {
    return (
        <div className="h-[50px] w-full relative bottom-0 left-0 flex justify-center items-center">
            <a className="text-white font-bold">2025© {process.env.NEXT_PUBLIC_WEBSITE_NAME} | All rights reserved</a>
        </div>
    )
}
