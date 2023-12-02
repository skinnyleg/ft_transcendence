
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';

import { withCookies, Cookies } from 'react-cookie';
interface DecodedToken {
  exp?: number; // Expiration time in seconds
  [key: string]: any; // Additional claims can be added based on your token structure
}

const withAuth = (WrappedComponent: any) => {
  const WithAuth = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
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
            router.push("/", undefined);
          } else {
            const auth = await res.json();
            if (!auth) {
              // Redirect to the login page
              router.push("/", undefined);
            }
          }
        } catch (error) {
          console.error("Error during authentication check:", error);
          router.push("/", undefined);
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
