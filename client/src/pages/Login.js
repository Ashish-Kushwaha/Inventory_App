import React, { useEffect, useState } from 'react'
import styles from './Login.module.css'
import Logo from '../assets/Logo.svg' 
import Eye from '../assets/Eye.svg'
import Frame from '../assets/Frame.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import Woman from "../assets/Women Web Developer with laptop.svg"
import Group from "../assets/Group.svg"
import Startup from "../assets/Startup.svg"

 
import { toast } from "react-toastify"; 
import { setUser } from '../redux/slices/authSlice' 
 


const Login = ({setIsLoggedIn,isMobile}) => {
  const dispatch=useDispatch()
  
  const navigate=useNavigate()
  const [loginDetails,setLoginDetails]=useState({email:"",password:""})
  const [email,setEmail]=useState("");
  const [emailCopy,setEmailCopy]=useState("");
  console.log(email);
  console.log(emailCopy);
  const [eyeToggle,setEyeToggle]=useState(false);
  const [eyecToggle,setEyecToggle]=useState(false);
  const [eyelToggle,setEyelToggle]=useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordDetails,setPasswordDetails]=useState({password:"",confirmPassword:""})
  const [login, setLogin] = useState(true);
  const [otpvalue, setOtpvalue] = useState();
  otpvalue&&console.log(otpvalue);
  const [emailContainer, setEmailContainer] = useState(false);
  const [otpC, setOtpC] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const handleLoginDetails=(e)=>{
   const {name,value}=e.target;
   setLoginDetails((prev)=>{
    return {...prev,[name]:value}
   })
  }
  function validateLogin() {
  
   let flag=false;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!loginDetails.email || loginDetails.email.trim() === "") {
    flag=true;
    toast.warn("Email is required")
  } else if (!emailRegex.test(loginDetails.email)) {
    flag=true;
    toast.warn("Invalid email address")
  }

  // Password validation
  if (!loginDetails.password || loginDetails.password.trim() === "") {
    flag=true;
    toast.warn("Password is required")
  } else if (loginDetails.password.length < 8) {
    flag=true;
    toast.warn("Password must be at least 8 characters long")
  }

  return flag;
}

  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const flag=validateLogin()
    if(flag){
      return;
    }
     setLoading(true);
     try{
    const response= await axios.post("https://inventory-app-ovzh.onrender.com/api/v1/users/login",loginDetails, { withCredentials: true })
   
    localStorage.setItem('user',JSON.stringify(response.data.data.user));
    setLoginDetails({email:"",password:""})
    toast.success("Logged in Successfully!!")
    setIsLoggedIn(true);
    navigate("/")
     }catch(err){
      console.log(err);
      toast.error("Login Failed!!")
     }finally{
        setLoading(false);
     }
    
  }
    function validateEmail() { 
  
   let flag=false;
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") {
    flag=true;
    toast.warn("Email is required")
  } else if (!emailRegex.test(email)) {
    flag=true;
    toast.warn("Invalid email address")
  }

  return flag;
}
  
  const handleEmailSubmit=async(e)=>{
   e.preventDefault();
   const flag=validateEmail();
   if(flag){
    return;
   }
   setLoading(true);
   try{
    const response=  await axios.post("https://inventory-app-ovzh.onrender.com/api/v1/users/send-mail",{email}, { withCredentials: true });
      console.log(response);
   setEmailContainer(false);
   setOtpC(true)
   setEmailCopy("");
   toast.success("Email Sent Successfully!");
   }catch(err){
    console.log(err);
    toast.error("Failed to send Email")
   }finally{
    setLoading(false);
   }
      
  }
  function validateOTP(otpvalue) {
  let flag=false;

  if (!otpvalue || otpvalue.trim() === "") {
    flag=true
    toast.warn("OTP is required")
  } else if (!/^\d{6}$/.test(otpvalue)) {
    flag=true
    toast.warn("OTP must be exactly 6 digits")
  }

  return flag;
}
  const handleOtpSubmit=async(e)=>{
    e.preventDefault();
    const flag=validateOTP();
    if(flag){
      return
    }
     setLoading(true);
     try{
        const email=JSON.parse(localStorage.getItem("emailForResetPassword"));
        
    const response=  await axios.post("https://inventory-app-ovzh.onrender.com/api/v1/users/verify-otp",{email:email,otp:otpvalue}, { withCredentials: true });
    console.log(response);
    setOtpC(false);
    setOtpvalue("");
    setResetPassword(true);
    toast.success("OTP Matched!")
     }catch(err){
      console.log(err);
      toast.error("OTP Match Failed")
     }finally{
      setLoading(false);
     }
   
    
  }
  function validateResetPassword() {
  let flag=false

  // Password validation
  if (!passwordDetails.password || passwordDetails.password.trim() === "") {
    flag=true
    toast.warn("Password is required")
  } else if (passwordDetails.password.length < 8) {
    flag=true
    toast.warn("Password must be at least 8 characters long")
  }

  // Confirm password validation
  if (!passwordDetails.confirmPassword || passwordDetails.confirmPassword.trim() === "") {
    flag=true
    toast.warn("Confirm password is required")
  } else if (passwordDetails.confirmPassword !== passwordDetails.password) {
    flag=true
    toast.warn("Passwords do not match")
  }

  return flag;
}

  const handleResetSubmit=async(e)=>{
    e.preventDefault();
    const flag=validateResetPassword();
    if(flag){
      return
    }
    setLoading(true);
    try{
      const email=localStorage.getItem("emailForResetPassword");
      const parEmail=JSON.parse(email)
      const response=  await axios.post("https://inventory-app-ovzh.onrender.com/api/v1/users/reset-password",{email:parEmail,password:passwordDetails.password,confirmPassword:passwordDetails.confirmPassword}, { withCredentials: true });
    console.log(response);
    localStorage.removeItem("emailForResetPassword");
    setResetPassword(false)
    setPasswordDetails({password:"",confirmPassword:""})
    setLogin(true)
    toast.success("Password Updated Successfully")
    }catch(err){
     console.log(err);
     toast.error("Password Updation Failed")
    }finally{
     setLoading(false)
    }
    
    
  }
  const handleResetPasswords=(e)=>{
    const {name,value}=e.target;
    setPasswordDetails((prev)=>{
      return {...prev,[name]:value}
    })
  }
  useEffect(()=>{ 
     localStorage.setItem('emailForResetPassword',JSON.stringify(email));
  },[email])
  return (
     <div className={styles["container"]}>
      
      <div className={styles["form-containers"]}>
        {login && (
            <div className={styles["login-container"]}>
              <div className={styles["welcome-container"]}>
                <div className={styles["heading"]}>
                  Log in to your account 
                </div>
                <div className={styles["text"]}>
                  <p>Welcome back! Please enter your details.</p> 
                </div>
              </div>

              <form onSubmit={(e)=>handleSubmit(e)}> 
                <div>
                  <label>Email</label>
                  <input type="email" value={loginDetails.email} onChange={(e)=>handleLoginDetails(e)} name='email' placeholder="Example@email.com" />
                </div>
                <div className={styles["password-container"]}>
                  <label>Password</label>
                  <input type={eyelToggle?"text":"password"} value={loginDetails.password} onChange={(e)=>handleLoginDetails(e)} name='password' placeholder="at least 8 characters" />
                  <img className={styles["eye-icon"]} onClick={()=>setEyelToggle(!eyelToggle)} src={Eye} alt="eye" />
                </div>
                <div className={styles["forgot"]} style={{cursor:"pointer"}} onClick={()=>{setLogin(false);
                  setEmailContainer(true);
                  setLogin(false);
                }}>Forgot Password?</div>
                <button style={{cursor:"pointer"}} disabled={loading} type='submit'>{loading?"Wait":"Sign in"}</button>
              </form>
              <div className={styles["signup"]}>
                Don't you have an account?<span style={{cursor:"pointer"}}  onClick={()=>navigate("/signup")}>Sign up</span>
              </div>
            </div>
        )}
        {emailContainer && (
            <div className={styles["email-container"]}>
              <div className={styles["email-text-container"]}>
                <div className={styles["heading"]}>
                  Company Name
                </div>
                {
                  isMobile?(<div className={styles["text"]}>
                  <p>Please enter your registered </p>
                  <p>email ID to recieve an OTP</p>
                </div>):(<div className={styles["text"]}>
                  <p>Please enter your registered email ID to</p>
                  <p>recieve an OTP</p>
                </div>)
                }
              </div>
              <form onSubmit={(e)=>handleEmailSubmit(e)} >
                <div>
                  <label>E-mail</label>
                <input type="email" value={emailCopy} onChange={(e)=>{setEmail(e.target.value);setEmailCopy(e.target.value)}} placeholder="Enter your registered email"/>
                </div>
                <button style={{cursor:"pointer"}} disabled={loading} type="submit">{loading?"Wait":"Send Mail"}</button>
              </form>
            </div>
        )}
        {otpC && (
            <div className={styles["otp-container"]}>
            <div className={styles["otp-text-container"]}>
              <div className={styles["heading"]}>Enter Your OTP</div>
            <div className={styles["text"]}>
              <p>We've sent a 6-digit OTP to your</p>
              <p>registered mail.</p>
              <p>Please enter it below to sign in.</p>
            </div>
            </div>
            <form onSubmit={(e)=>handleOtpSubmit(e)}>
              <div>
                <label>OTP</label>
              <input type="number" value={otpvalue} onChange={(e)=>setOtpvalue(e.target.value)}  placeholder="xxx05"/>
              </div>
              <button style={{cursor:"pointer"}} disabled={loading} type="submit">{loading?"Wait":"Confirm"}</button>
            </form>
          </div>
        )}
        {resetPassword && (
            <div className={styles["reset-password-container"]}>
            <div className={styles["reset-password-text-container"]}>
              <div className={styles["heading"]}>Create New Password</div>
            {
              isMobile?(<div className={styles["text"]}>
              <p>Today is a new day. It's your </p>
              <p>day. You shape it.</p>
              <p>Sign in to start managing your </p>
              <p>projects. </p>
            </div>):(<div className={styles["text"]}>
              <p>Today is a new day. It's your day. You shape it.</p>
              <p>Sign in to start managing your projects.</p>
            </div>)
            }
            </div> 
            <form onSubmit={(e)=>handleResetSubmit(e)}>
              <div className={styles["password-container"]}>
                <label>Enter New Password</label>
                <input type={eyeToggle?"text":"password"} name='password' value={passwordDetails.password} onChange={(e)=>handleResetPasswords(e)} placeholder="at least 8 characters"/>
                <img className={styles["eye-icon"]} onClick={()=>setEyeToggle(!eyeToggle)} src={Eye} alt="eye" />
              </div>
              <div className={styles["password-container"]}>
                <label>Confirm Password</label>
                <input type={eyecToggle?"text":"password"} name='confirmPassword' onChange={(e)=>handleResetPasswords(e)} value={passwordDetails.confirmPassword} placeholder="at least 8 characters" />
                <img className={styles["eye-icon"]} onClick={()=>setEyecToggle(!eyecToggle)} src={Eye} alt="eye" />
              </div>
              <button style={{cursor:"pointer"}} disabled={loading} type="submit">{loading?"Wait":"Reset Password"}</button>
            </form>
          </div>
        )}
      </div>
      <div className={styles["logo-container"]}>
        {
          login &&<>
          <div className={styles["logo-text-container"]}>
          <div className={styles["logo-text"]}>
            <p >Welcome to</p>
        <p>Company Name</p>
          </div>
        <img className={styles["logo"]} src={Logo} alt="logo" />
        </div>
        
        <div className={styles["frame-container"]}>
          <img className={styles["frame"]} src={Frame} alt="frame" />
        </div>
          </>
        }
        {
          emailContainer &&<div className={styles["email-image"]}>
            <img className={styles["side-Woman"]} src={Woman} alt="Woman" />
          </div>
        }
        {
          otpC && <div className={styles["otp-image"]}>
            <img className={styles["side-startup"]} src={Startup} alt="Group" />
          </div>
        }
        {
          resetPassword && <div className={styles["reset-image"]}>
            <img className={styles["side-Group"]} src={Group} alt="Group" />
          </div>
        }
      </div>
    </div>
  )
}

export default Login



// import React, { useState } from "react";

// const SubmitButton = () => {
//   const [loading, setLoading] = useState(false);

//   const handleClick = async () => {
//     setLoading(true); // disable + change color
//     try {
//       // Simulate API call (2s)
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       alert("Action completed ✅");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false); // reset
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       disabled={loading}
//       style={{
//         padding: "10px 20px",
//         backgroundColor: loading ? "#6c757d" : "#007bff", // gray when loading
//         color: "#fff",
//         border: "none",
//         borderRadius: "5px",
//         cursor: loading ? "not-allowed" : "pointer",
//         transition: "background-color 0.3s ease",
//       }}
//     >
//       {loading ? "Processing..." : "Click Me"}
//     </button>
//   );
// };

// export default SubmitButton;
