// import  { useState } from "react";
import styles from "./Sidebar.module.css";
import Logo from "../assets/Logo2.svg";
import Home from "../assets/Home.svg";
import Product from "../assets/Product.svg";
import Invoice from "../assets/Invoice.svg";
import Statistics from "../assets/Statistics.svg";
import Setting from "../assets/Setting.svg";
import {  useLocation, useNavigate } from "react-router-dom";


const Sidebar = ({isMobile}) => {
  const location = useLocation();
  const home = location.pathname==="/";
  const product = location.pathname.startsWith("/product");
  const invoices = location.pathname.startsWith("/invoices");
  const statistics = location.pathname.startsWith("/statistics");
  const settings = location.pathname.startsWith("/settings");
  const parUser=JSON.parse(localStorage.getItem("user"));
  const [firstName] = (parUser?.loggedInUser.fullName || "").split(" ");

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
            
          }
          
        }style={{
        backgroundColor: home ? '#424457' : '',
        
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
           
          }
        
        } style={{
        backgroundColor: product ? '#424457' : '',
        
      }}>
          {
            isMobile?(<div className={styles["img"]}>
              <img src={Product} alt="product"/>
            </div>
           ):(<><div className={styles["img"]}>
              <img src={Product}  alt="product"/>
            </div>
            <span>Product</span></>)
          }
            
          </div>
          <div className={styles["img-text"]} onClick={(e)=>{navigate("/invoices")
         
          }} style={{
        backgroundColor: invoices ? '#424457' : '',
        
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
          <div className={styles["img-text"]} onClick={()=>{navigate("/statistics")}}style={{
        backgroundColor: statistics ? '#424457' : '',
        
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
            isMobile?(<></>):(<div className={styles["img-text"]} onClick={()=>{navigate("/settings")}} style={{
        backgroundColor: settings ? '#424457' : '',
        
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
