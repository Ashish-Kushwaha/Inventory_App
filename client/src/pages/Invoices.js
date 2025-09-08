import  { useEffect, useState } from "react";
import styles from "./Invoices.module.css";
import { useDispatch } from "react-redux";
import { setInvoiceModal } from "../redux/slices/modalSlice";
import Delete from "../assets/Delete.svg";
import View from "../assets/View.svg";
import {
  setDueDate,
  setInvoiceAmount,
  setInvoiceID, 
  setInvoiceProducts,
  setInvoiceReference,  
} from "../redux/slices/invoicesSlice";  
import axios from "axios";
import { toast } from "react-toastify";
const Invoices = ({ isMobile }) => {
  const [invoiceModalId, setInvoiceModalId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [viewInvoice, setViewInvoice] = useState(false);
  const [deleteInvoice, setDeleteInvoice] = useState(false);
  const [paidInvoice, setPaidInvoice] = useState(false);
  const handlePaid = async (invoiceID) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `https://inventory-app-ovzh.onrender.com/api/v1/invoices/paid/${invoiceID}`,{},{
  withCredentials: true  
}
      );
      console.log(response.data.data);
      getPageInfo();
      toast.success("Invoice marked as paid");
    } catch (err) {
      console.log(err);
      toast.error("Invoice didnot marked as paid");
    } finally {
      setLoading(false);
    }
  };
  const handlePagination = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://inventory-app-ovzh.onrender.com/api/v1/invoices/paid/?page=${page}`,{
  withCredentials: true  
}
      );
      console.log(response.data);
      toast.success("Invoices Fetched Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (invoiceID) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://inventory-app-ovzh.onrender.com/api/v1/invoices/delete/${invoiceID}`,{
  withCredentials: true  
}
      );
      console.log(response.data);
      getPageInfo();
      setDeleteInvoice(false);
      toast.success("Invoice gets Deleted");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleView = async (invoiceID) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `https://inventory-app-ovzh.onrender.com/api/v1/invoices/view/${invoiceID}`,{},{
  withCredentials: true  
}
      );
      console.log(response.data);

      // getPageInfo();
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Something Went wrong");
    } finally {
      setLoading(false);
    }
  };
  const [paginatedInvoices, setPaginatedInvoices] = useState({});

  const [recentTransactions, setrecentTransactions] = useState(0);

  const [summary, setsummary] = useState({});

  const [last7DaysOverview, setlast7DaysOverview] = useState({});

  const getPageInfo = async (page) => {
    try {
      const response = await axios.get(
        `https://inventory-app-ovzh.onrender.com/api/v1/invoices/get-invoice-page-info/?page=${page}`,{
  withCredentials: true  
}
      );
      console.log(response.data.data);
      setPaginatedInvoices(response.data.data.paginatedInvoices);
      setrecentTransactions(response.data.data.recentTransactions);
      setsummary(response.data.data.summary);
      setlast7DaysOverview(response.data.data.last7DaysOverview);
      toast.success("Page Info Fetched Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };
  function formatDateToDDMMYY(isoDateString) {
  const date = new Date(isoDateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of year

  return `${day}/${month}/${year}`;
}
  useEffect(() => {
    getPageInfo(1);
  }, []);
  const dispatch = useDispatch();

  return (
   <>
   {
    isMobile?( <div className={styles["invoice-container"]}>
      <div className={styles["overall-invoice"]}>
        <p>Overall Invoice</p>
        <div className={styles["details-container"]}>
          <div className={styles["first-details"]}>
            <p className={styles["details-heading"]}>Recent Transactions</p>
            <p className={styles["details-value"]}>{recentTransactions || 0}</p>
            <span className={styles["details-text"]}>Last 7 days</span>
          </div>
         
          <div className={styles["other-details"]}>
            <p className={styles["details-heading"]}>Total Invoices</p>
            <div className={styles["details-value-container"]}>
              <span className={styles["details-value"]}>
                {last7DaysOverview[0]?.totalInvoices || 0}
              </span>
              <span className={styles["details-value"]}>
                ₹ {summary?.processed || 0}
              </span>
            </div>
            <div className={styles["details-text-container"]}>
              <span className={styles["details-text"]}>Last 7 days</span>
              <span className={styles["details-text"]}>Processed</span>
            </div>
          </div>
     
          <div className={styles["other-details"]}>
            <p className={styles["details-heading"]}>Paid Amount</p>
            <div className={styles["details-value-container"]}>
              <span className={styles["details-value"]}>
                ₹ {summary?.paidAmount || 0}
              </span>
              <span className={styles["details-value"]}>
                {" "}
                {summary?.totalCustomers || 0}
              </span>
            </div>
            <div className={styles["details-text-container"]}>
              <span className={styles["details-text"]}>Last 7 days</span>
              <span className={styles["details-text"]}>customers</span>
            </div>
          </div>

          <div className={styles["other-details"]}>
            <p className={styles["details-heading"]}>Unpaid Amount</p>
            <div className={styles["details-value-container"]}>
              <span className={styles["details-value"]}>
                ₹ {summary?.unpaidAmount || 0}
              </span>
              <span className={styles["details-value"]}>
                {summary?.pendingPayments || 0}
              </span>
            </div>
            <div className={styles["details-text-container"]}>
              <span className={styles["details-text"]}>Ordered</span>
              <span className={styles["details-text"]}>Pending Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["products"]}>
        <div className={styles["text-button-container"]}>
          <p>Invoices</p>
          {/* <button onClick={()=>dispatch(setAddProductModal(true))}>Add Product</button> */}
        </div>
        <table>
          <thead>
            <th>Invoice ID</th>
            <th></th>
          </thead>
          <tbody>
            {paginatedInvoices.invoices &&
              paginatedInvoices.invoices.map((inv) => {
                return (
                  <tr key={inv._id}>
                    <td>{inv.invoiceID}</td>
                    <td>
                      <div className={styles["date-dots"]}>
                        <div className={styles["date"]}>
                          <img src={View} alt="view" onClick={()=>{
                            dispatch(setInvoiceModal(true));
                            handleView(inv._id);
                            dispatch(setInvoiceID(inv._id));
                          }}/>
                          <img src={Delete} alt="delete" onClick={()=>{setInvoiceModalId(inv._id);
                            setDeleteInvoice(true);
                          }}/>
                        </div> 

                      </div>
                      {inv.status === "Unpaid"
                        ? invoiceModalId === inv._id &&
                          paidInvoice && (
                            <div
                              className={styles["invoice_overlay"]}
                              onClick={() => {
                                setPaidInvoice(false);
                                setInvoiceModalId(null);
                              }}
                            >
                              <div className={styles["paid-modal"]} onClick={(e) => e.stopPropagation()}>
                                <button
                                style={{cursor:"pointer"}}
                                  disabled={loading}
                                  type="button"
                                  onClick={() => handlePaid(inv._id)}
                                >
                                  {loading ? "Wait" : "Paid"}
                                </button>
                              </div>
                            </div>
                          )
                        : invoiceModalId === inv._id&&viewInvoice && (
                            <div
                              className={styles["invoice_overlay"]}
                              onClick={() => {
                                setViewInvoice(false);
                                setInvoiceModalId(null);
                                // setDeleteInvoice(false)
                              }}
                            >
                              <div className={styles["view-delete"]} onClick={(e) => e.stopPropagation()}>
                                <button
                                  // disabled={loading}
                                  style={{cursor:"pointer"}}
                                  type="button"
                                  className={styles["view"]}
                                  onClick={() => {
                                    dispatch(setInvoiceModal(true));
                                    handleView(inv._id);
                                    dispatch(setInvoiceID(inv._id));
                                    dispatch(setInvoiceProducts(inv.products));
                                  }}
                                >
                                  <img src={View} alt="view" />
                                  {loading ? "Wait" : "View Invoice"}
                                </button>
                                <div
                                  className={styles["delete"]}
                                  onClick={() => {
                                    setViewInvoice(false);
                                    setDeleteInvoice(true);
                                    setInvoiceModalId(inv._id);
                                  }}
                                >
                                  <img src={Delete} alt="delete" />
                                  delete
                                </div>
                              </div>
                            </div>
                          )}

                      {invoiceModalId === inv._id&&deleteInvoice && (
                        <div className={styles["invoice_overlay"]} onClick={()=>{
                          setDeleteInvoice(false);
                          setViewInvoice(false);
                          setInvoiceModalId(null);
                        }}>
                          <div className={styles["confirm-delete"]} onClick={(e) => e.stopPropagation()}>
                            <div className={styles["text"]}>
                              this invoice will be deleted.
                            </div>
                            <div className={styles["delete-cancel"]}>
                              <button
                              style={{cursor:"pointer"}}
                                className={styles["cancel"]}
                                onClick={() => {
                                  setDeleteInvoice(false);
                                  setViewInvoice(false);
                                  setInvoiceModalId(null);
                                }}
                              >
                                cancel
                              </button>
                              <button
                              style={{cursor:"pointer"}}
                                disabled={loading}
                                type="button"
                                className={styles["delete"]}
                                onClick={() => {
                                  handleConfirmDelete(inv._id);
                                }}
                              >
                                {loading ? "Wait" : "Confirm"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className={styles["pagination"]}>
          <button type="button" style={{cursor:"pointer"}} onClick={()=>getPageInfo(paginatedInvoices?.currentPage-1)} disabled={!paginatedInvoices?.hasPrev}>
            {loading ? "Wait" : "Previous"}
          </button>
          <p>
            Page {paginatedInvoices?.currentPage} of{" "}
            {paginatedInvoices?.totalPages}
          </p>
          <button style={{cursor:"pointer"}} onClick={()=>getPageInfo(paginatedInvoices?.currentPage+1)} type="button" disabled={!paginatedInvoices?.hasNext}>
            {loading ? "Wait" : "Next"}
          </button>
        </div>
      </div>

     
    </div>):( <div className={styles["invoice-container"]}>
      <div className={styles["overall-invoice"]}>
        <p>Overall Invoice</p>
        <div className={styles["details-container"]}>
          <div className={styles["first-details"]}>
            <p className={styles["details-heading"]}>Recent Transactions</p>
            <p className={styles["details-value"]}>{recentTransactions || 0}</p>
            <span className={styles["details-text"]}>Last 7 days</span>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["other-details"]}>
            <p className={styles["details-heading"]}>Total Invoices</p>
            <div className={styles["details-value-container"]}>
              <span className={styles["details-value"]}>
                {last7DaysOverview[0]?.totalInvoices || 0}
              </span>
              <span className={styles["details-value"]}>
                ₹ {summary?.processed || 0}
              </span>
            </div>
            <div className={styles["details-text-container"]}>
              <span className={styles["details-text"]}>Last 7 days</span>
              <span className={styles["details-text"]}>Processed</span>
            </div>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["other-details"]}>
            <p className={styles["details-heading"]}>Paid Amount</p>
            <div className={styles["details-value-container"]}>
              <span className={styles["details-value"]}>
                ₹ {summary?.paidAmount || 0}
              </span>
              <span className={styles["details-value"]}>
                {" "}
                {summary?.totalCustomers || 0}
              </span>
            </div>
            <div className={styles["details-text-container"]}>
              <span className={styles["details-text"]}>Last 7 days</span>
              <span className={styles["details-text"]}>customers</span>
            </div>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["other-details"]}>
            <p className={styles["details-heading"]}>Unpaid Amount</p>
            <div className={styles["details-value-container"]}>
              <span className={styles["details-value"]}>
                ₹ {summary?.unpaidAmount || 0}
              </span>
              <span className={styles["details-value"]}>
                {summary?.pendingPayments || 0}
              </span>
            </div>
            <div className={styles["details-text-container"]}>
              <span className={styles["details-text"]}>Ordered</span>
              <span className={styles["details-text"]}>Pending Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["products"]}>
        <div className={styles["text-button-container"]}>
          <p>Invoices</p>
          
        </div>
        <table >
          <thead>
            <th>Invoice ID</th>
            <th>Reference Number</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Due Date</th>
          </thead>
          <tbody>
            {paginatedInvoices.invoices &&
              paginatedInvoices.invoices.map((inv) => {
                return (
                  <tr key={inv?._id}>
                    <td>{inv?.invoiceID}</td>
                    <td>{inv?.referenceNumber || "-"}</td>
                    <td>{inv?.amount}</td>
                    <td>{inv?.status}</td>
                    <td>
                      <div className={styles["date-dots"]}>
                        <div className={styles["date"]}>{formatDateToDDMMYY(inv?.dueDate)}</div>
                        <div
                          className={styles["dots"]}
                          onClick={() => {
                            if (inv.status === "Unpaid") {
                              setPaidInvoice(true);
                            } else {
                              setViewInvoice(true);
                            }
                            setInvoiceModalId(inv?._id);
                          }}
                        >
                          <div className={styles["dot"]}></div>
                          <div className={styles["dot"]}></div>
                          <div className={styles["dot"]}></div>
                        </div>
                      </div>
                      {inv.status === "Unpaid"
                        ? invoiceModalId === inv?._id &&
                          paidInvoice && (
                            <div
                              className={styles["invoice_overlay"]}
                              onClick={() => {
                                setPaidInvoice(false);
                                setInvoiceModalId(null);
                              }}
                            >
                              <div className={styles["paid-modal"]} onClick={(e) => e.stopPropagation()}>
                                <button
                                style={{cursor:"pointer"}}
                                  disabled={loading}
                                  type="button"
                                  onClick={() => handlePaid(inv?._id)}
                                >
                                  {loading ? "Wait" : "Paid"}
                                </button>
                              </div>
                            </div>
                          )
                        : invoiceModalId === inv?._id&&viewInvoice && (
                            <div
                              className={styles["invoice_overlay"]}
                              onClick={() => {
                                setViewInvoice(false);
                                setInvoiceModalId(null);
                                // setDeleteInvoice(false)
                              }}
                            >
                              <div className={styles["view-delete"]} onClick={(e) => e.stopPropagation()}>
                                <button
                                style={{cursor:"pointer"}}
                                  disabled={loading}
                                  type="button"
                                  className={styles["view"]}
                                  onClick={() => {
                                    dispatch(setInvoiceModal(true));
                                    handleView(inv?._id);
                                    dispatch(setInvoiceID(inv?._id));
                                    dispatch(setInvoiceProducts(inv?.products||[]));
                                    dispatch(setInvoiceAmount(inv?.amount||0));
                                    dispatch(setInvoiceReference(inv?.referenceNumber||0));
                                    dispatch(setDueDate(inv?.dueDate||0));
                                    console.log(inv?.products);
                                    console.log(inv?._id)
                                  }}
                                >
                                  <img src={View} alt="view" />
                                  {loading ? "Wait" : "View Invoice"}
                                </button>
                                <div
                                  className={styles["delete"]}
                                  onClick={() => {
                                    setViewInvoice(false);
                                    setDeleteInvoice(true);
                                    setInvoiceModalId(inv?._id);
                                  }}
                                >
                                  <img src={Delete} alt="delete" />
                                  Delete
                                </div>
                              </div>
                            </div>
                          )}

                      {invoiceModalId === inv?._id&&deleteInvoice && (
                        <div className={styles["invoice_overlay"]} onClick={()=>{
                          setDeleteInvoice(false);
                          setViewInvoice(false);
                          setInvoiceModalId(null);
                        }}>
                          <div className={styles["confirm-delete"]} onClick={(e) => e.stopPropagation()}>
                            <div className={styles["text"]}>
                              this invoice will be deleted.
                            </div>
                            <div className={styles["delete-cancel"]}>
                              <button
                              style={{cursor:"pointer"}}
                                className={styles["cancel"]}
                                onClick={() => {
                                  setDeleteInvoice(false);
                                  setViewInvoice(false);
                                  setInvoiceModalId(null);
                                }}
                              >
                                cancel
                              </button>
                              <button
                              style={{cursor:"pointer"}}
                                disabled={loading}
                                type="button"
                                className={styles["delete"]}
                                onClick={() => {
                                  handleConfirmDelete(inv?._id);
                                }}
                              >
                                {loading ? "Wait" : "Confirm"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        


        <div className={styles["pagination"]}>
          <button type="button" style={{cursor:"pointer"}} onClick={()=>getPageInfo(paginatedInvoices?.currentPage-1)} disabled={!paginatedInvoices?.hasPrev
}>
            {loading ? "Wait" : "Previous"}
          </button>
          <p>
            Page {paginatedInvoices?.currentPage} of{" "}
            {paginatedInvoices?.totalPages}
          </p>
          <button type="button" style={{cursor:"pointer"}} onClick={()=>getPageInfo(paginatedInvoices?.currentPage+1)} disabled={!paginatedInvoices?.hasNext}>
            {loading ? "Wait" : "Next"}
          </button>
        </div>
      </div>

      
    </div>)
   }
   </>
  );
};

export default Invoices;
