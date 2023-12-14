import Cookies from "universal-cookie";

async function checkAuth(token:string | undefined)  {
    let success = true;
    try {
    //   const cookies = new Cookies();
      console.log(token);
    //   const refreshToken = cookies.get('refresh');
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

export default checkAuth;