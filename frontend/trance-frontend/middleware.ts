import { NextRequest, NextResponse } from "next/server";
import checkAuth from "./checktoken";

export default async function middleware(request: NextRequest){
    let token = request.cookies.get("token")?.value;
    const succes = await checkAuth(token);
    if (succes){
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/`));
}
 
export const config = {
  matcher: ['/Dashboard', '/settings', '/profile/:path*', '/Chat', '/Leaderboard', '/game/:path*']
}