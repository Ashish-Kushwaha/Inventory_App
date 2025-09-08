import  { useState } from "react";
import styles from "./Layout.module.css";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Search from "./assets/Search.svg";
import Cross from "./assets/Cross.svg";
import Filled_Cross from "./assets/Filled_Cross.svg";
import Upload_Folder from "./assets/Upload_Folder.svg";
import Chevron_Right from "./assets/Chevron_Right.svg";
import File_CSV_Solid from "./assets/File-CSV-Solid.svg";
import Logo from "./assets/Logo2.svg";
import Download from "./assets/Download.svg";
import Printer from "./assets/Printer.svg";
import Settings from "./assets/Setting.svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setAddProductModal,
  setIndividualProduct,
  setOrderModal,
  setUploadCSVFileModal,
  
  setInvoiceModal,
} from "./redux/slices/modalSlice";
import Icon from "./assets/icon.svg";

import axios from "axios";
import { setProductID } from "./redux/slices/productsSlice";
import Setting from "./components/Setting";
const Layout = ({ isMobile }) => {
  const { invoiceProducts, invoiceAmount, invoiceReference, dueDate } =
    useSelector((state) => state.invoices);
    const [loading, setLoading] = useState(false);
  const { invoiceID } = useSelector((state) => state.invoices);
  console.log(invoiceID);
  const handleDownloadInvoice = async (invoiceid) => {
      setLoading(true);
      try{
       const response = await axios.get(
      `https://inventory-app-ovzh.onrender.com/api/v1/invoices/download/${invoiceid}`,
      {
        responseType: "blob",

        withCredentials: true,
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${invoiceID}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Invoice downloaded successfully")
      }catch(err){
        console.log(err);
        toast.error("Error in downloading invoice")
      }finally{
        setLoading(false);
      }
    
    
  };
  const [decreaseBy, setDecreaseBy] = useState(null);
  const [isSettings, setIsSettings] = useState(null);
  const { productID } = useSelector((state) => state.products);
  console.log(productID);
  const [file, setFile] = useState(null);
  const location = useLocation();
  const home = location.pathname === "/";
  const product = location.pathname.startsWith("/product");
  const invoice = location.pathname.startsWith("/invoices");
  const statistics = location.pathname.startsWith("/statistics");
  const settings = location.pathname.startsWith("/settings");
  const { addProductModal, uploadCSVFileModal, orderModal, invoiceModal } =
    useSelector((state) => state.modal);
  function get10DaysBeforeFormatted(isoDateString) {
    const date = new Date(isoDateString);

    // Subtract 10 days (10 * 24 * 60 * 60 * 1000 milliseconds)
    const tenDaysBefore = new Date(date.getTime() - 10 * 24 * 60 * 60 * 1000);

    const day = String(tenDaysBefore.getUTCDate()).padStart(2, "0");
    const month = String(tenDaysBefore.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(tenDaysBefore.getUTCFullYear()).slice(-2); // Last two digits of year

    return `${day}-${month}-${year}`;
  }
  function formatDateToDDMMYY(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of year

    return `${day}-${month}-${year}`;
  }
  const handleCSVUpload = async () => {
    setLoading(true);
    try{
      const data = new FormData();
    data.append("file", file);
    const response = await axios.post(
      "https://inventory-app-ovzh.onrender.com/api/v1/products/many-products",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    
    dispatch(setUploadCSVFileModal(false));
    setFile(null);
    toast.success("CSV file uploaded successfully you should switch between 2 pages for changes to reflect")
    }catch(err){
      console.log(err);
      toast.error("Error in uploading csv file")
    }finally{
      setLoading(false);
    }
    
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  console.log(addProductModal);
  const dispatch = useDispatch();
  // const handleOrder=()=>{

  // }
  const handleQuantity = async () => {
    setLoading(true);
    try{
      const response = await axios.patch(
      `https://inventory-app-ovzh.onrender.com/api/v1/products/decrease-quantity/${productID}`,
      { decreaseBy },
      {
        withCredentials: true,
      }
    );
    console.log(response.data.data);
    dispatch(setOrderModal(false));
    dispatch(setProductID(""));
    setDecreaseBy(null);
    toast.success("Order placed successfully you should switch between 2 pages for changes to reflect")
    }catch(err){
      console.log(err);
      toast.error("Error in placing order")
    }finally{
      setLoading(false);
    }
    
  };
  return (
    <>
      <div className={styles["app"]}>
        <Sidebar isMobile={isMobile} />
        <div className={styles["main"]}>
          {isMobile ? (
            <div className={styles["logo_container"]}>
              <img src={Logo} alt="logo" />
              <img
                src={Settings}
                onClick={() => {
                  setIsSettings(true);
                  console.log("clicked");
                }}
                alt="settings"
              />
            </div>
          ) : (
            <div className={styles["page-heading"]}>
              {home && "Home"}
              {product && "Product"}
              {invoice && "Invoice"}
              {statistics && "Statistics"}
              {settings && "Settings"}
              <div className={styles["input-img"]}>
                {settings ? (
                  <></>
                ) : (
                  <>
                    <img src={Search} alt="search" />
                    <input type="text" placeholder="search here..." />
                  </>
                )}
              </div>
            </div>
          )}
          <Outlet />
          {addProductModal && (
            <div
              onClick={() => dispatch(setAddProductModal(false))}
              className={styles["overlay"]}
            >
              <div
                className={styles["product-modal"]}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles["button-container"]}>
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(setIndividualProduct(true));
                      dispatch(setAddProductModal(false));
                    }}
                  >
                    Individual product
                  </button>
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(setUploadCSVFileModal(true));
                      dispatch(setAddProductModal(false));
                    }}
                  >
                    Multiple product
                  </button>
                </div>
              </div>
            </div>
          )}
          {invoiceModal && (
            <div
              className={styles["overlay"]}
              onClick={() => dispatch(setInvoiceModal(false))}
            >
              <div
                className={styles["invoice-modal"]}
                onClick={(e) => e.stopPropagation()}
              >
                {isMobile ? (
                  <div
                    className={styles["red"]}
                    onClick={() => dispatch(setInvoiceModal(false))}
                  >
                    <div></div>
                    <img src={Cross} alt="cross" />
                  </div>
                ) : (
                  <>
                    <div className={styles["imgcontainer"]}>
                      <div
                        className={styles["red"]}
                        onClick={() => dispatch(setInvoiceModal(false))}
                      >
                        <img src={Cross} alt="cross" />
                      </div>
                      <div
                        onClick={() => handleDownloadInvoice(invoiceID)}
                        className={styles["blue"]}
                      >
                        <img src={Download} alt="download" />
                      </div>
                      <div
                        onClick={() => handleDownloadInvoice(invoiceID)}
                        className={styles["yellow"]}
                      >
                        <img src={Printer} alt="printer" />
                      </div>
                    </div>

                    <div className={styles["invoice-container"]}>
                      <div className={styles["invoice-details-container"]}>
                        <div className={styles["invoice_header"]}>
                          <h2>INVOICE</h2>
                          <div className={styles["company-details"]}>
                            <div style={{ fontWeight: "600" }}>Billed to</div>
                            <div
                              style={{ fontSize: ".7rem", color: "#a1a5ad" }}
                            >
                              <p>Company Name</p>
                              <p>Business address</p>
                            </div>
                            <div
                              style={{ fontSize: ".7rem", color: "#a1a5ad" }}
                            >
                              <p>Company address</p>
                              <p>City,State,IN-000000</p>
                            </div>
                            <div
                              style={{ fontSize: ".7rem", color: "#a1a5ad" }}
                            >
                              <p>City, Country-00000</p>
                              <p>TAX ID 00XXXXX123X0XX</p>
                            </div>
                          </div>
                        </div>
                        <div className={styles["invoice-details"]}>
                          <div className={styles["left"]}>
                            <div>
                              <p style={{ fontWeight: "600" }}>Invoice #</p>
                              <span
                                style={{ fontSize: ".7rem", color: "#636a76" }}
                              >
                                {invoiceID}
                              </span>
                            </div>
                            <div>
                              <p style={{ fontWeight: "600" }}>Invoice date</p>
                              <span
                                style={{ fontSize: ".7rem", color: "#636a76" }}
                              >
                                {get10DaysBeforeFormatted(dueDate)}
                              </span>
                            </div>
                            <div>
                              <p style={{ fontWeight: "600" }}>Reference</p>
                              <span
                                style={{ fontSize: ".7rem", color: "#636a76" }}
                              >
                                {invoiceReference}
                              </span>
                            </div>
                            <div>
                              <p style={{ fontWeight: "600" }}>Due Date</p>
                              <span
                                style={{ fontSize: ".7rem", color: "#636a76" }}
                              >
                                {formatDateToDDMMYY(dueDate)}
                              </span>
                            </div>
                          </div>
                          <div className={styles["right_container"]}>
                            <div className={styles["right"]}>
                              <table>
                                <thead
                                  style={{ backgroundColor: "transparent" }}
                                >
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                </thead>
                                <tbody>
                                  {Array.isArray(invoiceProducts) &&
                                    invoiceProducts.map((product) => {
                                      return (
                                        product && (
                                          <tr
                                            key={product._id}
                                            className={styles["product"]}
                                          >
                                            <td className={styles["name"]}>
                                              {product.productName}
                                            </td>
                                            <td className={styles["quantity"]}>
                                              {product.quantity}
                                            </td>
                                            <td className={styles["price"]}>
                                              ₹{product.price}
                                            </td>
                                          </tr>
                                        )
                                      );
                                    })}
                                </tbody>
                               
                                <tfoot>
                                  <tr>
                                    <td colSpan="3" style={{ padding: "5px" }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%",
                                          height: "100%",
                                          flexDirection: "column",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          Total Due: <p>₹{invoiceAmount}</p>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          Subtotal Due:{" "}
                                          <p>
                                            ₹{(invoiceAmount * 0.1).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3" style={{ padding: "5px" }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%",
                                          height: "100%",
                                          flexDirection: "column",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "space-between",
                                            color: "#118fa0",
                                            fontWeight: "600",
                                          }}
                                        >
                                          Total Due:{" "}
                                          <p>
                                            ₹
                                            {(
                                              invoiceAmount +
                                              invoiceAmount * 0.1
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            <div className={styles["note"]}>
                              <img src={Icon} alt="icon" />
                              <p>
                                Please pay within 10 days of receiving this
                                invoice
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles["invoice_footer"]}>
                        <p>www.recehtol.inc</p>
                        <p>+91 0000000000</p>
                        <p>hello@gmail.com</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {orderModal && (
            <div
              onClick={(e) => dispatch(setOrderModal(false))}
              className={styles["overlay"]}
            >
              <div
                className={styles["order-modal"]}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="number"
                  value={decreaseBy}
                  onChange={(e) => setDecreaseBy(e.target.value)}
                  placeholder="Enter quantity"
                />
                <button
                disabled={loading}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleQuantity();
                  }}
                  type="button"
                >
                  {loading?"Wait":"Order"}
                </button>
              </div>
            </div>
          )}
          {uploadCSVFileModal && (
            <div
              className={styles["overlay"]}
              onClick={() => dispatch(setUploadCSVFileModal(false))}
            >
              <div
                className={styles["upload-modal"]}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles["header"]}>
                  <div className={styles["text"]}>
                    <h3 style={{ margin: 0 }}>CSV Upload</h3>
                    <p style={styles.subtext}>Add your documents here</p>
                  </div>
                  <img
                    src={Cross}
                    alt="cross"
                    onClick={() => dispatch(setUploadCSVFileModal(false))}
                  />
                </div>
                <div className={styles["body"]}>
                  <img src={Upload_Folder} alt="upload_folder" />
                  <p>Drag your file(s) to start uploading</p>
                  <div className={styles["lines"]}>
                    <div className={styles["line"]}></div>
                    <p style={styles.orText}>OR</p>
                    <div className={styles["line"]}></div>
                  </div>
                  <button
                    style={{ cursor: "pointer" }}
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Browse files
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>

                {file && (
                  <div className={styles["files-upload-container"]}>
                    <div className={styles["file-upload-container"]}>
                      <div className={styles["img-text"]}>
                        <img src={File_CSV_Solid} alt="csv_solid" />
                        <div className={styles["text"]}>
                          {/* <p style={{ margin: 0 }}>{file.name}</p> */}
                          <p style={{ margin: 0 }}>{file.name}</p>
                          <span style={{ margin: 0 }}>
                            {(file.size / (1024 * 1024)).toFixed(1)}MB
                          </span>
                          {/* <small>{(file.size / (1024 * 1024)).toFixed(1)}MB</small> */}
                        </div>
                      </div>

                      <img
                        src={Filled_Cross}
                        alt="filled_cross"
                        onClick={() => setFile(null)}
                      />
                    </div>
                  </div>
                )}

                <div className={styles["footer"]}>
                  <button
                    className={styles["cancel"]}
                    onClick={() => dispatch(setUploadCSVFileModal(false))}
                  >
                    Cancel
                  </button>
                  {file ? (
                    <button
                    disabled={loading}
                      style={{ cursor: "pointer" }}
                      className={styles["upload"]}
                      onClick={() => {
                        handleCSVUpload();
                      }}
                    >
                      {loading?"Wait":"Upload"}
                    </button>
                  ) : (
                    <button
                      style={{ cursor: "pointer" }}
                      className={styles["next"]}
                    >
                      Next <img src={Chevron_Right} alt="chevron-right" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {isSettings && (
          <div className={styles["settings-menu"]}>
            <div className={styles["cross"]}>
              <img
                src={Cross}
                alt="cross"
                onClick={() => setIsSettings(false)}
              />
            </div>
            <Setting />
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
