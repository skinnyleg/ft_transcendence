import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "react-cookie";

async function checkAuth()  {
    try {
      const cookies = new Cookies();
      const token = cookies.get('token');
      const refreshToken = cookies.get('refresh');
      const res = await fetch("http://localhost:8000/auth/CheckToken", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: (localStorage.getItem('token')) ? localStorage.getItem('token') : ""})
      });
      if (res.status === 200){
        console.log("yooo")
        return true;
      }
      if (res.status === 401) {
       return false;
      } else {
        const auth = await res.json();
        if (!auth) {
         return false;
        }
      }
    } catch (error) {
     return false;
    }
  };

export default async function middleware(request: NextRequest){
    const succes = await fetch("http://localhost:8000/auth/CheckToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: ""})
    });
    console.log(succes.status)

    if (succes.status === 200){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}

export const config = {
    matcher: [ '/settings', '/profile/:path*']
}