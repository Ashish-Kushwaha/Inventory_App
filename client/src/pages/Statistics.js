

import  { useEffect, useState } from "react";

import styles from "./Statistics.module.css"; 
import Credit_Card from "../assets/Credit-Card.svg";
import Activity from "../assets/Activity.svg";
import Rupee_Sign from "../assets/Rupee-Sign.svg";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Calendar from "../assets/Calendar.svg" 
 import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const Statistics = ({isMobile}) => {
  const [view, setView] = useState("monthly");

  

  
    const {graph}=useSelector((state)=>state.dashboard)
    const {topProducts}=useSelector((state)=>state.products)
    
  // const reorder = (list, startIndex, endIndex) => {
  //   const result = Array.from(list);
  //   const [removed] = result.splice(startIndex, 1);
  //   result.splice(endIndex, 0, removed);
  //   return result;
  // };

  const handleSaveLayout= async(mainTiles,smallTiles)=>{
    try{
       await axios.put("https://inventory-app-ovzh.onrender.com/api/v1/statistics/save-layout",{mainTiles,smallTiles},{
  withCredentials: true  
})
      // toast.success("Layout Saved Successfully")
    }catch(err){
      console.log(err);
      toast.error("Something went wrong while saving layout")
    }
   
 
   
  }
  const [statistics,setStatistics]=useState({});
  console.log(statistics)
  const handleGetDetails=async()=>{
    try{
     const response=await axios.get("https://inventory-app-ovzh.onrender.com/api/v1/statistics/get-details",{
  withCredentials: true  
})
      setStatistics(response.data.data.statistics);
      toast.success("Page Info Fetched Successfully")
    }catch(err){
      console.log(err);
      toast.error("Something went wrong while fetching the page info")
    }   
  }
   const handleGetTiles=async()=>{
    try{
      const response=await axios.get("https://inventory-app-ovzh.onrender.com/api/v1/statistics/get-layout",{
  withCredentials: true  
})
      if(response.data.mainTiles.length>0){
        setMainTiles(response.data.mainTiles)

      }
       if(response.data.smallTiles.length>0){

         setSmallTiles(response.data.smallTiles)
       }
    toast.success("Layout Fetched Successfully")
    }catch(err){
      console.log(err);
      toast.error("Something went wrong while fetching the layout")
    }
   
  }
  useEffect(()=>{
    handleGetDetails()
    handleGetTiles()
  },[])
 

  
  const [mainTiles, setMainTiles] = useState([
    { id: "revenue", label: "revenue" },
    { id: "sold", label: "sold" },
    { id: "stock", label: "stock" }
  ]);

  // Small tiles state
  const [smallTiles, setSmallTiles] = useState([
    { id: "sales-purchase", label: "sales-purchase" },
    { id: "top-product", label: "top-product" }
  ]);
 
   
  const [dragInfo, setDragInfo] = useState(null);

  const handleDragStart = (e, index, type) => {
    setDragInfo({ index, type });
    e.dataTransfer.effectAllowed = "move";
 
  };

  const handleDragEnter = async(e, index, type) => {
    if (!dragInfo || dragInfo.type !== type) return;
 

    if (type === "tiles") {
      const newItems = [...mainTiles];
      const [moved] = newItems.splice(dragInfo.index, 1);
      newItems.splice(index, 0, moved);
      setMainTiles(newItems);
      console.log(newItems);
   
       handleSaveLayout(newItems,smallTiles)
      setDragInfo({ index, type });
    } else {
      const newItems = [...smallTiles];
      const [moved] = newItems.splice(dragInfo.index, 1);
      newItems.splice(index, 0, moved);
  
    setSmallTiles(newItems);
    console.log(newItems);
      handleSaveLayout(mainTiles,newItems)
      setDragInfo({ index, type });
    }
  };





  const renderTile = (id) => {
    switch (id) {
      case "revenue":
        return (
          <div className={styles["revenue-tile"]}>
            <div className={styles["text-img"]}>
              <p>Total Revenue</p>
              <img src={Rupee_Sign} alt="rupee" />
            </div>
            <div className={styles["amount-text"]}>
              <p>₹ {statistics?.totalRevenue ||0}</p>
              <span>+{statistics?.revenueIncreasePercent||0}% from last month</span>
            </div>
          </div>
        );
      case "sold":
        return (
          <div className={styles["Sold-tile"]}>
            <div className={styles["text-img"]}>
              <p>Products Sold</p>
              <img src={Credit_Card} alt="credit" />
            </div>
            <div className={styles["amount-text"]}>
              <p>{statistics?.productsSold||0}</p>
              <span>+{statistics?.productsSoldIncreasePercent||0}% from last month</span>
            </div>
          </div>
        );
      case "stock":
        return (
          <div className={styles["Stock-tile"]}>
            <div className={styles["text-img"]}>
              <p>Products in Stock</p>
              <img src={Activity} alt="activity" />
            </div>
            <div className={styles["amount-text"]}>
              <p>{statistics?.productsInStock||0}</p>
              <span>+{statistics?.productsInStockIncreasePercent||0}% from last month</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSalesTop = (id) => {
    switch (id) {
      case "sales-purchase":
        return (
           <div className={styles["sales-and-purchase"]}>
            <div>
              <p>Sales & Purchase</p  >
              <img src={Calendar} alt="calender"/>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <ResponsiveContainer  width="100%" height={200}>
              <BarChart data={graph[view]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchase" fill="#4f9df7" name="Purchase" />
                <Bar dataKey="sales" fill="#34c38f" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "top-product":
        return (
          <div className={styles["top-product"]}>
            <p>Top Product</p>
             {
                  topProducts && topProducts.map((product)=>{
                    return (
                      <div className={styles["products_container"]}>
                        <div className={styles["product"]}>
                            <div className={styles["name_img"]}>
                              <div className={styles["name"]}>
                                {
                                  product?.productName

                                }
                              </div>
                              <div className={styles["img"]}>
                                {
                                  product?.productImage ?<img src={product.productImage} alt="imge"/>:""
                                }
                                
                              </div>
                            </div>
                            <div className={styles["rating"]}>
                              <div className={styles["rectangle"]}></div>
                              <div className={styles["rectangle"]}></div>
                              <div className={styles["rectangle"]}></div>
                            </div>
                        </div>
                      </div>
                    )
                  })
                }
          </div>
        );
      default:
        return null;
    }
  };
  return (
   


  



  
    <>
       {
        isMobile?(<>
        <div className={styles["statistics-container"]}>
          <div className={styles["sale-and-top-container"]}>
             <div className={styles["sales-and-purchase"]}>
            <div>
              <p>Sales & Purchase</p  >
              <img src={Calendar} alt="calender"/>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <ResponsiveContainer  width="80%" height={200}>
              <BarChart data={graph[view]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchase" fill="#4f9df7" name="Purchase" />
                <Bar dataKey="sales" fill="#34c38f" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
          <div className={styles["tiles-container"]}>
             <div className={styles["revenue-tile"]}>
            <div className={styles["text-img"]}>
              <p>Total Revenue</p>
              <img src={Rupee_Sign} alt="rupee" />
            </div>
            <div className={styles["amount-text"]}>
              <p>₹ {statistics?.totalRevenue ||0}</p>
              <span>+{statistics?.revenueIncreasePercent||0}% from last month</span>
            </div>
          </div>
            <div className={styles["Sold-tile"]}>
            <div className={styles["text-img"]}>
              <p>Products Sold</p>
              <img src={Credit_Card} alt="credit" />
            </div>
            <div className={styles["amount-text"]}>
              <p>{statistics?.productsSold||0}</p>
              <span>+{statistics?.productsSoldIncreasePercent||0}% from last month</span>
            </div>
          </div>
           <div className={styles["Stock-tile"]}>
            <div className={styles["text-img"]}>
              <p>Products in Stock</p>
              <img src={Activity} alt="activity" />
            </div>
            <div className={styles["amount-text"]}>
              <p>{statistics?.productsInStock||0}</p>
              <span>+{statistics?.productsInStockIncreasePercent||0}% from last month</span>
            </div>
          </div>
          </div>
        </div>
        </>):(<div className={styles["statistics-container"]}>
  {/* Top three tiles */}
  <div className={styles["tiles-container"]}>
    {mainTiles?.map((id, index) => (
      <div
        key={id.id}
        draggable
        onDragStart={(e) => handleDragStart(e, index, "tiles")}
        onDragEnter={(e) => handleDragEnter(e, index, "tiles")}
        
      >
        {renderTile(id.id)}
      </div>
    ))}
  </div>

  {/* Bottom two tiles */}
  <div className={styles["sale-and-top-container"]}>
    {smallTiles?.map((id, index) => (
      <div
        key={id.id}
        draggable
        onDragStart={(e) => handleDragStart(e, index, "salesTop")}
        onDragEnter={(e) => handleDragEnter(e, index, "salesTop")}
        className={styles["tile-wrapper"]}
      >
        {renderSalesTop(id.id)}
      </div>
    ))}
  </div>
</div>)
       }
    
    </>

  );
}

  

export default Statistics;



            
          
       
 