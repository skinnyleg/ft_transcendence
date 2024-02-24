import Cookies from "universal-cookie";

async function checkAuth(token:string | undefined)  {
    let success = true;
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_MIDDLEWARE}/auth/CheckToken`, {
        method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      });
      if (res.status === 401) {
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
    }
    finally{
      return success;
    }
};

export default checkAuth;