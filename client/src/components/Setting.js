import React from 'react'
import styles from "./Setting.module.css"
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
const Setting = ({setIsLoggedIn}) => {
    const [settingUser,setsettingUser]=useState({})
  // console.log(settingUser) 
  const [edit,setEdit]=useState(true);
  const [account,setAccount]=useState(false)
  const [loading, setLoading] = useState(false);
  const [user,setUser]=useState({fullName:"",lastName:"",email:"",password:"",confirmPassword:""})
  console.log(user);
  function validateUser() {
  let flag=false;

  // Full Name validation
  if (!user.fullName || user.fullName.trim() === "") {
    flag=true;
    toast.warn("Full name is required")
  } else if (user.fullName.length < 3) {
    flag=true;
    toast.warn("Full name must be at least 3 characters")
  } else if (!/^[A-Za-z\s]+$/.test(user.fullName)) {
    flag=true;
    toast.warn("Full name must contain only letters")
  }

  // Last Name validation
  if (!user.lastName || user.lastName.trim() === "") {
    flag=true;
    toast.warn("Last name is required")
  } else if (user.lastName.length < 2) {
    flag=true;
    toast.warn("Last name must be at least 2 characters")
  } else if (!/^[A-Za-z\s]+$/.test(user.lastName)) {
    flag=true;
    toast.warn("Last name must contain only letters")
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || user.email.trim() === "") {
    flag=true;
    toast.warn("Email is required")
  } else if (!emailRegex.test(user.email)) {
    flag=true;
    toast.warn("Invalid email address")
  }

  // Password validation
  if (!user.password || user.password.trim() === "") {
    flag=true;
    toast.warn("Password is required")
  } else if (user.password.length < 8) {
    flag=true;
    toast.warn("Password must be at least 8 characters long")
  }

  // Confirm Password validation
  if (!user.confirmPassword || user.confirmPassword.trim() === "") {
    flag=true;
    toast.warn("Confirm password is required")
  } else if (user.confirmPassword !== user.password) {
    flag=true;
    toast.warn("Passwords do not match")
  }

  return flag;
}

  const Handlechange=(e)=>{
    const {name,value} =e.target;
    setUser((prev)=>{
     return {...prev,[name]:value}

    })
  }
   const getInitials=(name)=>{
      const words=name.trim().split(" ");
      if(words.length===1){
        return words[0][0].toUpperCase();
      }  
      return (words[0][0]+words[1][0]).toUpperCase(); 
    }
  const handleSave= async()=>{
    const flag=validateUser();
    if(flag){
      return;
    }
      setLoading(true)
      try{
        const response= await axios.patch("http://localhost:8000/api/v1/users/edit-user-info",{firstName:user.fullName,lastName:user.lastName,email:user.email,password:user.password,confirmPassword:user.confirmPassword},{
  withCredentials: true  
});
        console.log(response.data.data.user);
  
      toast.success("User Info Saved Successfully")
      }catch(err){
        console.log(err);
        toast.error("Something went wrong while saving User Info")
      }finally{
        setLoading(false)
      }
    }
   const parUser=JSON.parse(localStorage.getItem("user"));
   console.log(parUser)
   useEffect(()=>{
    const [firstName, ...lastParts] = (parUser?.loggedInUser.fullName || "").split(" ");
    setUser({
      fullName:firstName||"",
      lastName:lastParts.join(" ") || "",
      email:parUser?.loggedInUser?.email,
      password:parUser?.password,
      confirmPassword:parUser?.password,
    })
   },[])
  //  setsettingUser(parUser)
  console.log(user);
   const handleLogout=async()=>{

      setLoading(true)
      try{
        const response= await axios.post("http://localhost:8000/api/v1/users/logout",{},{
  withCredentials: true  
});  
        console.log(response)
        localStorage.removeItem("user");
        setIsLoggedIn(false)
        
      toast.success("Logged Out Successfully")
      }catch(err){
        console.log(err)
        toast.error("Something went wrong while Log Out")
      }finally{
        setLoading(false)
      }
    }

  return (
    <div className={styles["settings-container"]}>
       <div className={styles["settings-header"]}>
         <p onClick={()=>{setEdit(true);setAccount(false)}}>Edit Profile</p>
         <p onClick={()=>{setEdit(false);setAccount(true)}}>Account management</p>
       </div>
       {
        edit && <div className={styles["edit-profile"]}>
            <div className={styles["form"]}>
              <div>
                <label>First name</label>
                <input type='text' name='fullName' onChange={(e)=>Handlechange(e)} value={user.fullName}  placeholder='First name'/>
              </div>
              <div> 
                <label>Last name</label>
                <input value={user.lastName} name='lastName' onChange={(e)=>Handlechange(e)} placeholder='Last name'/>
              </div>
              <div>
                <label>Email</label>
                <input type='email' value={user.email} name='email' onChange={(e)=>Handlechange(e)} placeholder='Email'/>
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={user.password} name='password' onChange={(e)=>Handlechange(e)} placeholder='Password'/>
              </div>
              <div>
                <label>Confirm Password</label>
                <input type="password" value={user.confirmPassword} name='confirmPassword' onChange={(e)=>Handlechange(e)} placeholder='Confirm Password'/>
              </div>
            </div>
            <div className={styles["button"]}>
              <button disabled={loading} onClick={()=>handleSave()} type='button'>{loading?"Wait":"Save"} </button>
            </div>
        </div>
       }
       {
        account && <div className={styles["edit-profile"]}>
           <div className={styles["management-container"]}>
             <div>
              <p>Identity verification</p>
              <span>Verified</span>
             </div>
             <div>
                <p>Add Accounts</p>
              </div>
           </div>
           {/* remove from localstorage */}
           <div className={styles["button"]}><button type='button' onClick={()=>handleLogout()} disabled={loading} className={styles["log-out"]}>{loading?"Wait":"Log Out"}</button></div>
        </div>
       }
    </div>
  )
}

export default Setting