import  { useState } from "react";
import styles from "./Sidebar.module.css";
import Logo from "../assets/Logo2.svg";
import Home from "../assets/Home.svg";
import Product from "../assets/Product.svg";
import Invoice from "../assets/Invoice.svg";
import Statistics from "../assets/Statistics.svg";
import Setting from "../assets/Setting.svg";
import {  useNavigate } from "react-router-dom";


const Sidebar = ({isMobile}) => {
  const [navText,setNavText]=useState("Home");
  const parUser=JSON.parse(localStorage.getItem("user"));
  const [firstName, ...lastParts] = (parUser?.loggedInUser.fullName || "").split(" ");

  const navigate=useNavigate();


 
  return (
    <div className={styles["sidebar-container"]}>
      {
        isMobile?(<></>):(<div className={styles["logo-container"]}>
        <img src={Logo} alt="logo" />
      </div>)
      }
      <div className={styles["nav-user-container"]}>
        <div className={styles["nav-container"]}>
          <div className={styles["img-text"]} onClick={(e)=>{navigate("/")
            setNavText("Home")
          }
          
        }style={{
        backgroundColor: navText==="Home" ? '#424457' : '',
        
      }}  >
          {
            isMobile?(<div className={styles["img"]}>
              <img src={Home} alt="home" />
            </div>
           ):(<><div className={styles["img"]}>
              <img src={Home} alt="home" />
            </div>
            <span>Home</span></>)
          }
            
          </div>
          <div className={styles["img-text"]} onClick={(e)=>{navigate("/product")
            setNavText("Product")
          }
        
        } style={{
        backgroundColor: navText==="Product" ? '#424457' : '',
        
      }}>
          {
            isMobile?(<div className={styles["img"]}>
              <img src={Product} />
            </div>
           ):(<><div className={styles["img"]}>
              <img src={Product} />
            </div>
            <span>Product</span></>)
          }
            
          </div>
          <div className={styles["img-text"]} onClick={(e)=>{navigate("/invoices")
            setNavText("Invoice")
          }} style={{
        backgroundColor: navText==="Invoice" ? '#424457' : '',
        
      }}>
            {
            isMobile?(<div className={styles["img"]}>
              <img src={Invoice} alt="invoice" />
            </div>
           ):(<><div className={styles["img"]}>
              <img src={Invoice} alt="invoice" />
            </div>
            <span>Invoice</span></>)
          }
            
          </div>
          <div className={styles["img-text"]} onClick={()=>{navigate("/statistics");setNavText("Statistics")}}style={{
        backgroundColor: navText==="Statistics" ? '#424457' : '',
        
      }} >
            {
            isMobile?(<div className={styles["img"]}>
              <img src={Statistics} alt="statistics" />
            </div>
           ):(<><div className={styles["img"]}>
              <img src={Statistics} alt="statistics" />
            </div>
            <span>Statistics</span></>)
          }
            
          </div>
          {
            isMobile?(<></>):(<div className={styles["img-text"]} onClick={()=>{navigate("/settings");setNavText("Setting")}} style={{
        backgroundColor: navText==="Setting" ? '#424457' : '',
        
      }} >
            <div className={styles["img"]}>
              <img src={Setting} alt="setting" />
            </div>
            <span>Setting</span>
          </div>)
          }
        </div>
        {
          isMobile?(<></>):(<div className={styles["user-container"]}>
          <div className={styles["initials-text-container"]}><div className={styles["initials-container"]}></div>
          {firstName}</div>
          
        </div>)
        }
      </div>
    </div>
  );
};

export default Sidebar;
