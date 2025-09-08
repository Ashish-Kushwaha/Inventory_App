
import  { useEffect, useState } from "react";

import styles from "./Dashboard.module.css";
import Sales from "../assets/Sales.svg";
import Calendar from "../assets/Calendar.svg";
import Revenue from "../assets/Revenue.svg";
import Profit from "../assets/Profit.svg";
import Cost from "../assets/Cost.svg";
import Purchase from "../assets/Purchase.svg";
import Cost2 from "../assets/Cost_Yellow.svg";
import Cancel from "../assets/Cancel.svg";
import Return from "../assets/Return.svg";
import Quantity from "../assets/Quantity.svg";
import Received from "../assets/On the way.svg";
import Suppliers from "../assets/Suppliers.svg";
import Categories from "../assets/Categories.svg";
import { setGraph } from "../redux/slices/dashboardSlice";
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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTopProducts } from "../redux/slices/productsSlice";
import { toast } from "react-toastify";
  
// Dummy data


const Dashboard = ({ isMobile }) => {

  const dispatch=useDispatch();
 
   
 

  const [view, setView] = useState("monthly");
 
 
  const handleSaveLayout= async(overview,summary)=>{
   try{
     await axios.put("https://inventory-app-ovzh.onrender.com/api/v1/home/save-layout",{overview,summary},{
  withCredentials: true  
})
    //  toast.success("Layout Saved Successfully!")
   }catch(err){
     console.log(err);
     toast.error("Layout is not Saved!")
   }
  
   
 
   
  }
  const handleGetLayout= async()=>{
    try{
      const respone=await axios.get("https://inventory-app-ovzh.onrender.com/api/v1/home/get-layout",{
  withCredentials: true  
})
     
      if(respone.data?.overview?.length>0)
      {
        setOverview(respone.data.overview)

      }
      if(respone.data?.summary?.length>0){
        setSummary(respone.data.summary)

      }
    toast.success("Layout Fetched Successfully")
    }catch(err){
      console.log(err);
      toast.error("Layougt didn't Fetched")
    }
  }
  




  const {graph}=useSelector((state)=>state.dashboard)
  const {topProducts}=useSelector((state)=>state.products)
  
  const [inventorySummary,setInventorySummary]=useState();
 
  const [productSummary,setProductSummary]=useState();
  
  const [purchaseOverview,setPurchaseOverview]=useState();

  const [salesOverview,setsalesOverview]=useState();




  const handleGetInfo=async()=>{
    try{
        const response = await axios.get(
      "https://inventory-app-ovzh.onrender.com/api/v1/home/get-page-info",{
  withCredentials: true  
}
    );

    dispatch(setTopProducts(response.data.data.topProducts))

    setsalesOverview(response.data.data.salesOverview);
  
    setPurchaseOverview(response.data.data.purchaseOverview);
   
    dispatch(setGraph(response.data.data.graphs))
    setInventorySummary(response.data.data.inventorySummary)
    setProductSummary(response.data.data.productSummary)
  
   
    setTopProducts(response.data.data.topProducts)
 
    if(response.data?.overview?.lenght>0){
     setOverview(response.data.overview)
   }
   if(response.data?.summary?.lenght>0){
    setSummary(response.data.summary)
   }
   toast.success("Page Fetched Successfully")
    }catch(err){
      console.log(err);
      toast.error("Page didn't Fetched")
    }
    
  }
   const [overview, setOverview] = useState([
    { id: "sales-overview", label: "Sales Overview" },
    { id: "purchase-overview", label: "Purchase Overview" },
    { id: "sales-and-purchase", label: "Sales & Purchase" },
  ]);

  // Summary cards
  const [summary, setSummary] = useState([
    { id: "inventory-summary", label: "Inventory Summary" },
    { id: "product-summary", label: "Product Summary" },
    { id: "top-product", label: "Top Product" },
  ]);
  useEffect(()=>{
     handleGetInfo();
     handleGetLayout();
  },[overview,summary])
  


  const [dragInfo, setDragInfo] = useState(null);

  const handleDragStart = (e, index, type) => {
    setDragInfo({ index, type });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index, type) => {
    if (!dragInfo || dragInfo.type !== type) return;

    if (type === "overview") {
      const newItems = [...overview];
      const [moved] = newItems.splice(dragInfo.index, 1);
      newItems.splice(index, 0, moved);
      setOverview(newItems);
      console.log(newItems)
      handleSaveLayout(newItems,summary)
      setDragInfo({ index, type });
    } else {
      const newItems = [...summary];
      const [moved] = newItems.splice(dragInfo.index, 1);
      newItems.splice(index, 0, moved);
      console.log(newItems);
      setSummary(newItems);
      handleSaveLayout(overview,newItems)
      setDragInfo({ index, type });
    }
  };

  const renderOverviewItem = (id) => {
    switch (id) {
      case "sales-overview":
        return (
          <div className={styles["sales-overview"]}>
            <p>Sales Overview</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-and-details"]}>
                <img src={Sales} alt="sales" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.totalSales||0}</span>
                  <p>Sales</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Revenue} alt="revenue" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.totalRevenue||0}</span>
                  <p>Revenue</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Profit} alt="profit" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.profit||0}</span>
                  <p>Profit</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Cost} alt="cost" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.totalCost||0}</span>
                  <p>Cost</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "purchase-overview":
        return (
          <div className={styles["purchase-overview"]}>
            <p>Purchase Overview</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-and-details"]}>
                <img src={Purchase} alt="purchase" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.totalPurchase||0}</span>
                  <p>Purchase</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Cost2} alt="cost" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.purchaseCost||0}</span>
                  <p>Cost</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Cancel} alt="cancel" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.canceled||0}</span>
                  <p>Cancel</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Return} alt="return" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.returned||0}</span>
                  <p>Return</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "sales-and-purchase":
        return (
          <div className={styles["sales-and-purchase"]}>
            <div>
              <p>Sales & Purchase</p>
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
            <ResponsiveContainer width="100%" height={200}>
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
      default:
        return null;
    }
  };

  const renderSummaryItem = (id) => {
    switch (id) {
      case "inventory-summary":
        return (
          <div className={styles["inventory-summary"]}>
            <p>Inventory Summary</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-details"]}>
                <img src={Quantity} alt="quantity" />
                <span>{inventorySummary?.quantityInHand||0}</span>
                <p>Quantity in Hand</p>
              </div>
              <div className={styles["img-details"]}>
                <img src={Received} alt="received" />
                <span>{inventorySummary?.toBeReceived||0}</span>
                <p>To be received</p>
                
              </div>
            </div>
          </div>
        );
      case "product-summary":
        return (
          <div className={styles["product-summary"]}>
            <p>Product Summary</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-details"]}>
                <img src={Suppliers} alt="suppliers" />
                <p>{productSummary?.suppliers||0}</p>
                <p>Numbers of</p>
                <p>Suppliers</p>
              </div>
              <div className={styles["img-details"]}>
                <img src={Categories} alt="categories" />
                <p>{productSummary?.categories||0}</p>
                <p>Numbers of</p>
                <p>Categories</p>
              </div>
            </div>
          </div>
        );
      case "top-product":
        return (
          <div className={styles["top-product"]}>
            <p>Top Products</p>
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
                                  product?.productImage ?<img src={product.productImage || ""} alt="ime"/>:""
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
      isMobile?(<div className={styles["dashboard-container"]}>
      <div className={styles["overview-container"]}>
        <div className={styles["sales-and-purchase"]}>
              <div>
              <span>Sales & Purchase</span>
              <img src={Calendar} alt="calender"/>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
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
          <div className={styles["sales-overview"]}>
            <p>Sales Overview</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-and-details"]}>
                <img src={Sales} alt="sales" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.totalSales||0}</span>
                  <p>Sales</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Revenue} alt="revenue" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.totalRevenue||0}</span>
                  <p>Revenue</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Profit} alt="profit" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.profit||0}</span>
                  <p>Profit</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Cost} alt="cost" />
                <div className={styles["details"]}>
                  <span>₹ {salesOverview?.totalCost||0}</span>
                  <p>Cost</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["purchase-overview"]}>
            <p>Purchase Overview</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-and-details"]}>
                <img src={Purchase} alt="purchase" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.totalPurchase ||0}</span>
                  <p>Purchase</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Cost2} alt="cost" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.purchaseCost||0}</span>
                  <p>Cost</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Cancel} alt="cancel" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.canceled||0}</span>
                  <p>Cancel</p>
                </div>
              </div>
              <div className={styles["img-and-details"]}>
                <img src={Return} alt="return" />
                <div className={styles["details"]}>
                  <span>₹ {purchaseOverview?.returned}</span>
                  <p>Return</p>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className={styles["summary-container"]}>
         <div className={styles["inventory-summary"]}>
            <p>Inventory Summary</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-details"]}>
                <img src={Quantity} alt="quantity" />
                <span>{inventorySummary?.quantityInHand||0}</span>
                <p>Quantity in Hand</p>
              </div>
              <div className={styles["img-details"]}>
                <img src={Received} alt="received" />
                <span>{inventorySummary?.toBeReceived||0}</span>
                <p>To be received</p>
              </div>
            </div>
          </div>
           <div className={styles["product-summary"]}>
            <p>Product Summary</p>
            <div className={styles["img-details-container"]}>
              <div className={styles["img-details"]}>
                <img src={Suppliers} alt="suppliers" />
                <p>{productSummary?.suppliers||0}</p>
                <p>Numbers of</p>
                <p>Suppliers</p>
              </div>
              <div className={styles["img-details"]}>
                <img src={Categories} alt="categories" />
                <p>{productSummary?.categories||0}</p>
                <p>Numbers of</p>
                <p>Categories</p>
              </div>
            </div>
          </div>
          <div className={styles["top-product"]}>
            <p>Top Product</p>
            {
                  topProducts && topProducts.map((product,index)=>{
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
                                  product?.productImage ?<img src={product.productImage || ""} alt="imge"/>:""
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
      </div>
    </div>):(<div className={styles["dashboard-container"]}>
      <div className={styles["overview-container"]}>
        {overview.map((id, index) => (
          <div
            key={id.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index, "overview")}
            onDragEnter={(e) => handleDragEnter(e, index, "overview")}
            className={styles["draggable"]}
          >
            {renderOverviewItem(id.id)}
          </div>
        ))}
      </div>

      <div className={styles["summary-container"]}>
        {summary.map((id, index) => (
          <div
            key={id.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index, "summary")}
            onDragEnter={(e) => handleDragEnter(e, index, "summary")}
            className={styles["draggable"]}
          >
            {renderSummaryItem(id.id)}
          </div>
        ))}
      </div>
    </div>)
    }
    
    </>  

    
  );
}

export default Dashboard
