"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";


export default  async function isAuth(Component: any) {
  return async function IsAuth(props: any) {
    const res = await fetch("http://localhost:8000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("token") }),    
    });
    const auth = false;
    console.log(auth);

    useEffect(() => {
      if (!auth) {
        return redirect("/");
      }
    }, []);


    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}