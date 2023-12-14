import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "react-cookie";
import checkAuth from "./checktoken";



export default async function middleware(request: NextRequest){
    const token  = request.cookies.get("token");
    const succes = await checkAuth(token?.value);
    console.log(succes)

    if (token?.value){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}

export const config = {
    matcher: ['/Dashboard', '/settings', '/profile/:path*']
}