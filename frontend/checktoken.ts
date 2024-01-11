import Cookies from "universal-cookie";

async function checkAuth(token:string | undefined)  {
    let success = true;
    try {
      console.log(token);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/CheckToken`, {
        method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      });
      console.log("status", res.status);
      if (res.status === 401) {
        console.log("fuck");
        success = false;
      }
      if (res.status === 200){
        success = true;
        return success;
      }
      else{
        return false;
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