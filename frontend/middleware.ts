import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "react-cookie";
import checkAuth from "./checktoken";

// const checkVerification = async () => {
//     let success = true;
//     try {
//       console.log(token);
      
//       const res = await fetch("http://localhost:8000/auth/CheckToken", {
//         method: 'GET',
//       headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//       },
//       });
//       console.log("status", res.status);
//       if (res.status === 401) {
//         console.log("fuck");
//         success = false;
//       }
//       if (res.status === 200){
//         success = true;
//         return success;
//       }
//       else{
//         return false;
//       }
//     } catch (error) {
//         success = false;
//       console.error("Error during authentication check:", error);
//     }
//     finally{
//       return success;
//     }
// }

export default async function middleware(request: NextRequest){
    const token  = request.cookies.get("token");
    const succes = await checkAuth(token?.value);
    // const isFirstTime = await checkVerification();
    console.log("hsa", succes);

    if (succes){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}

export const config = {
    matcher: ['/Dashboard', '/settings', '/profile/:path*', '/Chat', '/Leaderboard']
}