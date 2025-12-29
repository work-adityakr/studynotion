import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { setUser } from "../../../slices/profileSlice"
import { setToken } from "../../../slices/authSlice";


const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch=useDispatch();

    useEffect( () => {
        const handleAuth = async () => {
        const token = searchParams.get("token");

        console.log("oauth",token);
        
        if (token) {
            localStorage.setItem("token", JSON.stringify(token));
            // Also update your Redux state if using it
            // dispatch(setToken(token)); 
            try {
                const res = await axios.get("http://localhost:4000/auth/me",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
               
                if(res.data.success){
                dispatch(setUser({ ...res.data.user }))
                dispatch(setToken(token))
                
            navigate("/dashboard/my-profile"); 
                }
            } catch (error) {
                console.log("Error Fetching User",error)
            }
            
        } else {
            navigate("/login");
        }
    }
        handleAuth();
    }, [searchParams, navigate,dispatch]);


    return <div>Authenticating... Please wait.</div>;
};

export default AuthSuccess;