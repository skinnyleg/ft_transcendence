
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';

import { withCookies, Cookies } from 'react-cookie';


const withAuth = (WrappedComponent: any) => {
  const WithAuth = async (props: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

    async function checkAuth()  {
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
        if (res.status === 200){
          console.log("lops")
          setLoading(false);
        }
        if (res.status === 401) {
          // Redirect to the login page
          return false;
        } else {
          const auth = await res.json();
          if (!auth) {
            // Redirect to the login page
            return false;
          }
        }
      } catch (error) {
        return false;
        console.error("Error during authentication check:", error);
      }
    };
    const de = await checkAuth();
    console.log("lol", de);
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
