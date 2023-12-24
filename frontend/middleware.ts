import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "react-cookie";
import checkAuth from "./checktoken";

const checkVerification = async (token:string | undefined) => {
    try {      
      const res = await fetch("http://localhost:8000/auth/CheckFirstLogin", {
        method: 'GET',
        credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      });
      console.log("status", res.status);
      if (res.status === 401) {
        console.log("fuck");
        return true;
      }
      if (res.status === 200){
        const isfirst = await res.json();
        return (isfirst.FirstLogin === false) ? false : true;
      }
      else{
        return true;
      }
    } catch (error) {
        console.error("Error during authentication check:", error);
        return true;
    }
}

export default async function middleware(request: NextRequest){
    const token  = request.cookies.get("token");
    const succes = await checkAuth(token?.value);

    let isFirstTime = await checkVerification(token?.value);
    if (request.nextUrl.pathname === '/settings')
        isFirstTime = false;
    console.log("hsa", isFirstTime);
    
    if (succes && !isFirstTime){
        return NextResponse.next();
    }
    if (isFirstTime)
      return NextResponse.redirect(new URL("http://localhost:3000/settings"));

    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}

export const config = {
    matcher: ['/Dashboard', '/settings', '/profile/:path*', '/Chat', '/Leaderboard']
}