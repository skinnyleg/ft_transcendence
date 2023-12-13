
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';

import { withCookies, Cookies } from 'react-cookie';


const withAuth = (WrappedComponent: any) => {
  const WithAuth = (props: any) => {
  const router = useRouter();
  // const [loading, setLoading] = useState(true);

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
        if (res.status === 401) {
          // Redirect to the login page
          router.replace('/', undefined);
          return null;
        } else {
          const auth = await res.json();
          if (!auth) {
            // Redirect to the login page
            router.replace('/', undefined);
          }
        }
      } catch (error) {
        router.replace('/', undefined);
        console.error("Error during authentication check:", error);
      }
    };
    checkAuth();

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
