import { NextRequest, NextResponse } from "next/server";
import checkAuth from "./checktoken";

const checkVerification = async (token:string | undefined) => {
    try {      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/CheckFirstLogin`, {
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

const refreshToken = async (refreshtoken : string) => {
  try {      
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/refresh`, {
      method: 'GET',
      credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshtoken}`
    },
    });
    console.log("status", res.status);
    const result = res.json()
    if (res.status === 200) {
      return result;
    }
    if (res.status === 401){
      console.log("unauthorized")
      return result;
    }
    else{
      return result;
    }
  } catch (error) {
      console.error("Error during authentication check:", error);
      return ;
  }
}

export default async function middleware(request: NextRequest){
    let token  = request.cookies.get("token")?.value;
    console.log('token in middleware === ', token);
    const refreshtoken  = request.cookies.get("refresh");
    // let response: NextResponse = new NextResponse;
    // if (IsExpired){
    //   const {token , refresh} = await refreshToken(refreshtoken?.value as string);
    //   console.log('token == ', token)
    //   console.log('refresh == ', refresh)
    //   // token  = refresh;
    //   response.cookies.set("token", token as string);
    //   response.cookies.set("refresh", refresh as string);
    //   return response;
    // }
    const succes = await checkAuth(token);
    // let isFirstTime = await checkVerification(token);
    // if (request.nextUrl.pathname === '/settings')
    //   isFirstTime = false;
    if (succes){
      console.log('here 200')
      return NextResponse.next();
    }
    // if (isFirstTime)
    //   return NextResponse.redirect(new URL("http://localhost:3000/settings"));
    return NextResponse.redirect(new URL("/", "http://localhost:3000/"));
}
 
export const config = {
  matcher: ['/Dashboard', '/settings', '/profile/:path*', '/Chat', '/Leaderboard']
}