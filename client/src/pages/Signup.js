import React, { useState } from "react";
import styles from "./Signup.module.css";
import Logo from "../assets/Logo.svg";
import Eye from "../assets/Eye.svg";
import Frame from "../assets/Frame.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { toast } from "react-toastify";
const Signup = ({isMobile}) => {
  const [user,setUser]=useState({fullName:"",email:"",password:"",confirmPassword:""})
  // console.log(user);
  const navigate=useNavigate();
  const Handlechange=(e)=>{
    const {name,value} =e.target;
    setUser((prev)=>{
     return {...prev,[name]:value}

    })
  }
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setcPasswordVisible] = useState(false);
  function validateUser() {
  let flag=false
  
  // Full name validation
  if (!user.fullName || user.fullName.trim() === "") {
  flag = true;
  toast.warn("Full name is required");
} else if (user.fullName.length < 3) {
  flag = true;
  toast.warn("Full name must be at least 3 characters");
} else if (!/^[A-Za-z\s]+$/.test(user.fullName)) {
  flag = true;
  toast.warn("Full name should contain only alphabets");
}

  // Email validation (basic regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || user.email.trim() === "") {
    flag=true
    toast.warn( "Email is required")
  } else if (!emailRegex.test(user.email)) {
    flag=true
    toast.warn("Invalid email address")
  }

  // Password validation
  if (!user.password) {
    flag=true
    toast.warn("Password is required")
  } else if (user.password.length < 8) {
    flag=true
    toast.warn("Password must be at least 8 characters long")
  }

  // Confirm password validation
  if (!user.confirmPassword) {
    flag=true
    toast.warn("Confirm password is required")
  } else if (user.confirmPassword !== user.password) {
    flag=true
    toast.warn("Passwords do not match")
  }

  return flag;
}

   const [loading, setLoading] = useState(false);
  const handleSignupSubmit=async(e)=>{ 
   e.preventDefault();
   const error=validateUser();
   if(error){
    return;
   }
   setLoading(true)
   try{
     const response= await axios.post("http://localhost:8000/api/v1/users/register",user,{ withCredentials: true })
     console.log(response);
   navigate("/login")
   toast.success("Signed Up Successfully!! Please Login")
   }catch(err){
      console.log(err);
      toast.error("Signed UP Failed");
   }finally{ 
    setLoading(false);
   }
     
  }
  return (
    <>
    {
      isMobile?(<div className={styles["container"]}>
      <div className={styles["form-container"]}>
        <div className={styles["login-container"]}>
        <div className={styles["welcome-container"]}>
          <div className={styles["heading"]}>Create an account</div>
          <div className={styles["text"]}>
            <p>Start inventory management</p>
          </div>
        </div>

        <form onSubmit={(e)=>handleSignupSubmit(e)}>
          <div>
            <label>Name</label>
            <input type="text" name="fullName" value={user.fullName} onChange={Handlechange} placeholder="Name" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={user.email} onChange={Handlechange} placeholder="Example@email.com" />
          </div>
          <div className={styles["password-container"]}>
            <label>Create Password</label>
            <input type={passwordVisible?"text":"password"} name="password" value={user.password} onChange={Handlechange} placeholder="at least 8 characters" />
            <img className={styles["eye-icon"]} onClick={()=>setPasswordVisible(!passwordVisible)} src={Eye} alt="eye" />
          </div>
          <div className={styles["password-container"]}>
            <label>Confirm Password</label>
            <input type={cpasswordVisible?"text":"password"} name="confirmPassword" value={user.confirmPassword} onChange={Handlechange} placeholder="at least 8 characters" />
            <img className={styles["eye-icon"]} onClick={()=>setcPasswordVisible(!cpasswordVisible)} src={Eye} alt="eye" />
          </div>
          <button style={{cursor:"pointer"}} disabled={loading} type="submit" >{loading?"Wait":"Sign up"}</button>
        </form>
        <div className={styles["signup"]}>
          Don't you have an account?<span style={{cursor:"pointer"}} onClick={()=>navigate("/login")}>Sign in</span>
        </div>
      </div>
      </div>
      
    </div>):(<div className={styles["container"]}>
      <div className={styles["form-container"]}>
        <div className={styles["login-container"]}>
        <div className={styles["welcome-container"]}>
          <div className={styles["heading"]}>Create an account</div>
          <div className={styles["text"]}>
            <p>Start inventory management</p>
          </div>
        </div>

        <form onSubmit={(e)=>handleSignupSubmit(e)}>
          <div>
            <label>Name</label>
            <input type="text" name="fullName" value={user.fullName} onChange={Handlechange} placeholder="Name" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={user.email} onChange={Handlechange} placeholder="Example@email.com" />
          </div>
          <div className={styles["password-container"]}>
            <label>Create Password</label>
            <input type={passwordVisible?"text":"password"} name="password" value={user.password} onChange={Handlechange} placeholder="at least 8 characters" />
            <img className={styles["eye-icon"]} onClick={()=>setPasswordVisible(!passwordVisible)} src={Eye} alt="eye" />
          </div>
          <div className={styles["password-container"]}>
            <label>Confirm Password</label>
            <input type={cpasswordVisible?"text":"password"} name="confirmPassword" value={user.confirmPassword} onChange={Handlechange} placeholder="at least 8 characters" />
            <img className={styles["eye-icon"]} onClick={()=>setcPasswordVisible(!cpasswordVisible)} src={Eye} alt="eye" />
          </div>
          <button style={{cursor:"pointer"}} disabled={loading} type="submit" >{loading?"Wait":"Sign up"}</button>
        </form>
        <div className={styles["signup"]}>
          Don't you have an account?<span style={{cursor:"pointer"}} onClick={()=>navigate("/login")}>Sign in</span>
        </div>
      </div>
      </div>
      <div className={styles["logo-container"]}>
        <div className={styles["logo-text-container"]}>
          <div className={styles["logo-text"]}>
            <p>Welcome to</p>
            <p>Company Name</p>
          </div>
          <img className={styles["logo"]} src={Logo} alt="logo" />
        </div>
        {/* <img className={styles["frame"]} src={Frame} alt="frame" /> */}
        <div className={styles["frame-container"]}>
          <img className={styles["frame"]} src={Frame} alt="frame" />
        </div>
      </div>
    </div>)
    }
    </>
  );
};

export default Signup;
