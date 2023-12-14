import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "react-cookie";

async function checkAuth()  {
  let success = true;
  try {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const refreshToken = cookies.get('refresh');
    const res = await fetch("http://localhost:8000/auth/CheckToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: (token) ? token : ""})
    });
    if (res.status === 401) {
      console.log("fuck");
      success = false;
    } else {
      const auth = await res.json();
      if (!auth) {
        success = false;
      }
    }
  } catch (error) {
      success = false;
    console.error("Error during authentication check:", error);
  }
  finally{
    return success;
  }
};

export default async function middleware(request: NextRequest){
    const succes = await checkAuth();
    console.log(succes)

    if (succes){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}

export const config = {
    matcher: ['/Dashboard', '/settings', '/profile/:path*']
}