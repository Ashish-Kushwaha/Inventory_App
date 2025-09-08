import React, { useEffect, useState } from "react";
import styles from "./Product.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddProductModal,
  setIndividualProduct,
  setOrderModal,
} from "../redux/slices/modalSlice";
import { toast } from "react-toastify";
import Color_Chevron_Right from "../assets/Color_Chevron_Right.svg";
import Cross from "../assets/Cross.svg";
import axios from "axios";
import { setProductID } from "../redux/slices/productsSlice";
import Info from "../assets/Info.svg";
const Product = ({ isMobile }) => {
  const [tableContent, setTableContent] = useState([]);
  const [addProduct, setAddProduct] = useState({
    productName: "",
    productImage: null,
    productID: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    thresholdValue: "",
  });
  console.log(addProduct);
  const [loading, setLoading] = useState(false);
  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setAddProduct((prev) => {
        return {
          ...prev,
          [name]: files[0],
        };
      });
    } else {
      setAddProduct((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
  function validateProduct() {
    let flag = false;

    // Product Name
    if (!addProduct.productName || addProduct.productName.trim() === "") {
      flag = true;
      toast.warn("Product name is required");
    } else if (!/^[A-Za-z0-9\s]+$/.test(addProduct.productName)) {
      flag = true;
      toast.warn("Product name must contain only letters, numbers, and spaces");
    }

    // Product Image
    if (!addProduct.productImage) {
      flag = true;
      toast.warn("Product image is required");
    }

    // Product ID
    if (!addProduct.productID || addProduct.productID.trim() === "") {
      flag = true;
      toast.warn("Product ID is required");
    }

    // Category
    if (!addProduct.category || addProduct.category.trim() === "") {
      flag = true;
      toast.warn("Category is required");
    }

    // Price
    if (!addProduct.price || addProduct.price.trim() === "") {
      flag = true;
      toast.warn("Price is required");
    } else if (isNaN(addProduct.price) || Number(addProduct.price) <= 0) {
      flag = true;
      toast.warn("Price must be a valid number greater than 0");
    }

    // Quantity
    if (!addProduct.quantity || addProduct.quantity.trim() === "") {
      flag = true;
      toast.warn("Quantity is required");
    } else if (
      !Number.isInteger(Number(addProduct.quantity)) ||
      Number(addProduct.quantity) < 0
    ) {
      flag = true;
      toast.warn("Quantity must be a non-negative integer");
    }

    // Unit
    if (!addProduct.unit || addProduct.unit.trim() === "") {
      flag = true;
      toast.warn("Unit is required");
    }

    // Expiry Date
    if (!addProduct.expiryDate || addProduct.expiryDate.trim() === "") {
      flag = true;
      toast.warn("Expiry date is required");
    } else if (new Date(addProduct.expiryDate) <= new Date()) {
      flag = true;
      toast.warn("Expiry date must be in the future");
    }

    // Threshold Value
    if (!addProduct.thresholdValue || addProduct.thresholdValue.trim() === "") {
      flag = true;
      toast.warn("Threshold value is required");
    } else if (
      isNaN(addProduct.thresholdValue) ||
      Number(addProduct.thresholdValue) < 0
    ) {
      flag = true;
      toast.warn("Threshold value must be a non-negative number");
    }

    return flag;
  }

  const handleSubmit = async () => {
    const flag = validateProduct();
    if (flag) {
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("productName", addProduct.productName);
      data.append("productID", addProduct.productID);
      data.append("category", addProduct.category);
      data.append("expiryDate", addProduct.expiryDate);
      data.append("price", addProduct.price);
      data.append("productImage", addProduct.productImage);
      data.append("quantity", addProduct.quantity);
      data.append("thresholdValue", addProduct.thresholdValue);
      data.append("unit", addProduct.unit);

      const response = await axios.post(
        "https://inventory-app-ovzh.onrender.com/api/v1/products/add-product",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log(response);
      dispatch(setIndividualProduct(false));
      setAddProduct({
        productName: "",
        productImage: null,
        productID: "",
        category: "",
        price: "",
        quantity: "",
        unit: "",
        expiryDate: "",
        thresholdValue: "",
      });
      getPageInfo(1);
      toast.success("New Product Added Individually");
    } catch (err) {
      console.log(err);
      toast.error("Something Went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  const { individualProduct } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState([]);

  const [pID, setPID] = useState(null);
  console.log(pagination.products);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState(0);
  const [outOfStock, setOutOfstock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [topSelling, setTopSelling] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  console.log(pagination.hasNextPage);
  console.log(pagination.hasPrevPage);
  
  const getPageInfo = async (page) => {
    try {
      console.log("page", page);
      const response = await axios.get(
        `https://inventory-app-ovzh.onrender.com/api/v1/products/get-product-page-info/?page=${page}`,{
  withCredentials: true  
}
      );

      setPagination(response.data.data.pagination);
      console.log(response.data.data.pagination);
      setTotalProducts(response.data.data.totalProducts);
      setCategories(response.data.data.categoriesCount);
      setOutOfstock(response.data.data.outOfStock);
      setLowStock(response.data.data.lowStock);
      setTopSelling(response.data.data.topSelling);
      setTotalRevenue(response.data.data.totalRevenue);
      toast.success("Page Info Fetched Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Unsuccessful Page Info Fetch");
    }
  };
  useEffect(() => {
    getPageInfo(1);
  }, [tableContent]);
  function formatDateToDDMMYY(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of year

    return `${day}/${month}/${year}`;
  }
 
  const [productDetails, setProductDetails] = useState(false);
  return (
    <>
      {isMobile ? (
        <>
          {individualProduct ? (
            <div className={styles["individual-product-container"]}>
              <div className={styles["individual-header"]}>
                <p>Add Product</p>
                <img src={Color_Chevron_Right} alt="Color_Chevron_Right" />
                <p>Individual Product</p>
              </div>
              <div className={styles["form-button-container"]}>
                <p>New Product</p>
                <div className={styles["img-text"]}>
                  <div className={styles["img"]}>
                    {addProduct.productImage?.name}
                  </div>
                  <div className={styles["text"]}>
                    <p>Drag image here</p>
                    <p>or</p>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        document.getElementById("image-input").click()
                      }
                    >
                      Browse image
                    </span>
                    <input
                      type="file"
                      id="image-input"
                      accept="image"
                      name="productImage"
                      style={{ display: "none" }}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className={styles["form"]}>
                  <div className={styles["form-field"]}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={addProduct.productName}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Product ID</label>
                    <input
                      type="text"
                      name="productID"
                      value={addProduct.productID}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product ID"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={addProduct.category}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Select product category"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={addProduct.price}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={addProduct.quantity}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product quantity"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={addProduct.unit}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product unit"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={addProduct.expiryDate}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter expiry date"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Threshold Value</label>
                    <input
                      type="number"
                      name="thresholdValue"
                      value={addProduct.thresholdValue}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter threshold value "
                    />
                  </div>
                </div>
                <div className={styles["buttons"]}>
                  <button
                    style={{ cursor: "pointer" }}
                    className={styles["discard"]}
                    onClick={() => dispatch(setIndividualProduct(false))}
                  >
                    Discard
                  </button>
                  <button
                    style={{ cursor: "pointer" }}
                    className={styles["add_product"]}
                    onClick={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? "Wait" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["product-container"]}>
              <div className={styles["overall-inventory"]}>
                <p>Overall Inventory</p>
                <div className={styles["details-container"]}>
                  <div className={styles["first-details"]}>
                    <p className={styles["details-heading"]}>Categories</p>
                    <p className={styles["details-value"]}>{categories || 0}</p>
                    <span className={styles["details-text"]}>Last 7 days</span>
                  </div>

                  <div className={styles["other-details"]}>
                    <p className={styles["details-heading"]}>Total Products</p>
                    <div className={styles["details-value-container"]}>
                      <span className={styles["details-value"]}>
                        {totalProducts || 0}
                      </span>
                      <span className={styles["details-value"]}>
                        ₹ {totalRevenue || 0}
                      </span>
                    </div>
                    <div className={styles["details-text-container"]}>
                      <span className={styles["details-text"]}>
                        Last 7 days
                      </span>
                      <span className={styles["details-text"]}>Revenue</span>
                    </div>
                  </div>

                  <div className={styles["other-details"]}>
                    <p className={styles["details-heading"]}>Top Selling</p>
                    <div className={styles["details-value-container"]}>
                      <span className={styles["details-value"]}>
                        {topSelling || 0}
                      </span>
                      <span className={styles["details-value"]}>₹ 0</span>
                    </div>
                    <div className={styles["details-text-container"]}>
                      <span className={styles["details-text"]}>
                        Last 7 days
                      </span>
                      <span className={styles["details-text"]}>Cost</span>
                    </div>
                  </div>

                  <div className={styles["other-details"]}>
                    <p className={styles["details-heading"]}>Low Stocks</p>
                    <div className={styles["details-value-container"]}>
                      <span className={styles["details-value"]}>
                        {lowStock || 0}
                      </span>
                      <span className={styles["details-value"]}>
                        {outOfStock || 0}
                      </span>
                    </div>
                    <div className={styles["details-text-container"]}>
                      <span className={styles["details-text"]}>Ordered</span>
                      <span className={styles["details-text"]}>
                        Not in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles["products"]}>
                <div className={styles["text-button-container"]}>
                  <p>Products</p>
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => dispatch(setAddProductModal(true))}
                  >
                    Add Product
                  </button>
                </div>

                <table>
                  <thead>
                    <th>Products</th>

                    <th>Availability</th>
                  </thead>
                  <tbody>
                    {pagination.products &&
                      pagination.products.map((product, index) => {
                        return (
                          <tr
                            onClick={() => {
                              dispatch(setOrderModal(true));
                              dispatch(setProductID(product._id));
                            }}
                            key={product._id}
                          >
                            <td>{product.productName}</td>
                            <td>
                              <div className={styles["availabillity_info"]}>
                                {product.availability === "In-stock" ? (
                                  <span className={styles.inStock}>
                                    {product.availability}
                                  </span>
                                ) : product.availability === "out-of-stock" ? (
                                  <span className={styles.outOfStock}>
                                    {product.availability}
                                  </span>
                                ) : product.availability === "expired" ? (
                                  <span className={styles.expired}>
                                    {product.availability}
                                  </span>
                                ) : (
                                  <span className={styles.lowStock}>
                                    {product.availability}
                                  </span>
                                )}
                                <img
                                  onClick={() => {
                                    setProductDetails(true);
                                    setPID(product._id);
                                  }}
                                  src={Info}
                                  alt="info"
                                />
                              </div>
                            </td>
                            {productDetails && pID === product._id && (
                              <>
                                <div className={styles["product_details"]}>
                                  <div
                                    className={styles["product_details_header"]}
                                  >
                                    <div className={styles["text"]}>
                                      <p>Product Details</p>
                                      <p>{product.productName}</p>
                                    </div>
                                    <img
                                      src={Cross}
                                      alt="cross"
                                      onClick={() => {
                                        setProductDetails(false);
                                        setPID(null);
                                      }}
                                    />
                                  </div>
                                  <div className={styles["line"]}>
                                    <p>Price</p>
                                    <span>₹{product.price}</span>
                                  </div>
                                  <div className={styles["line"]}>
                                    <p>Quantity</p>
                                    <span>{product.quantity}</span>
                                  </div>
                                  <div className={styles["line"]}>
                                    <p>Thrshold Value</p>
                                    <span>{product.thresholdValue}</span>
                                  </div>
                                  <div className={styles["line"]}>
                                    <p>Expiry Date</p>
                                    <span>
                                      {formatDateToDDMMYY(product.expiryDate)}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div className={styles["pagination"]}>
                  <button
                    style={{ cursor: "pointer" }}
                    disabled={!pagination.hasPrevPage}
                    type="button"
                    onClick={() => getPageInfo(pagination.currentPage - 1)}
                  >
                    {loading ? "Wait" : "Previous"}
                  </button>
                  <p>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                  <button
                    style={{ cursor: "pointer" }}
                    disabled={!pagination.hasNextPage}
                    type="button"
                    onClick={() => getPageInfo(pagination.currentPage + 1)}
                  >
                    {loading ? "Wait" : "Next"}
                  </button>
                </div>
              </div>

              
            </div>
          )}
        </>
      ) : (
        <>
          {individualProduct ? (
            <div className={styles["individual-product-container"]}>
              <div className={styles["individual-header"]}>
                <p>Add Product</p>
                <img src={Color_Chevron_Right} alt="Color_Chevron_Right" />
                <p>Individual Product</p>
              </div>
              <div className={styles["form-button-container"]}>
                <p>New Product</p>
                <div className={styles["img-text"]}>
                  <div
                    className={styles["img"]}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: ".7rem",
                    }}
                  >
                    {addProduct.productImage?.name}
                  </div>
                  <div className={styles["text"]}>
                    <p>Drag image here</p>
                    <p>or</p>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        document.getElementById("image-input").click()
                      }
                    >
                      Browse image
                    </span>
                    <input
                      type="file"
                      id="image-input"
                      accept="image"
                      name="productImage"
                      style={{ display: "none" }}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className={styles["form"]}>
                  <div className={styles["form-field"]}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={addProduct.productName}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Product ID</label>
                    <input
                      type="text"
                      name="productID"
                      value={addProduct.productID}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product ID"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={addProduct.category}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Select product category"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={addProduct.price}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={addProduct.quantity}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product quantity"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={addProduct.unit}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter product unit"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={addProduct.expiryDate}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter expiry date"
                    />
                  </div>
                  <div className={styles["form-field"]}>
                    <label>Threshold Value</label>
                    <input
                      type="number"
                      name="thresholdValue"
                      value={addProduct.thresholdValue}
                      onChange={(e) => handleOnChange(e)}
                      placeholder="Enter threshold value "
                    />
                  </div>
                </div>
                <div className={styles["buttons"]}>
                  <button
                    style={{ cursor: "pointer" }}
                    className={styles["discard"]}
                    onClick={() => {
                      dispatch(setIndividualProduct(false));
                      setAddProduct({
                        productName: "",
                        productImage: null,
                        productID: "",
                        category: "",
                        price: "",
                        quantity: "",
                        unit: "",
                        expiryDate: "",
                        thresholdValue: "",
                      });
                    }}
                  >
                    Discard
                  </button>
                  <button
                    style={{ cursor: "pointer" }}
                    className={styles["add_product"]}
                    onClick={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? "Wait" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["product-container"]}>
              <div className={styles["overall-inventory"]}>
                <p>Overall Inventory</p>
                <div className={styles["details-container"]}>
                  <div className={styles["first-details"]}>
                    <p className={styles["details-heading"]}>Categories</p>
                    <p className={styles["details-value"]}>{categories || 0}</p>
                    <span className={styles["details-text"]}>Last 7 days</span>
                  </div>
                  <div className={styles["line"]}></div>
                  <div className={styles["other-details"]}>
                    <p className={styles["details-heading"]}>Total Products</p>
                    <div className={styles["details-value-container"]}>
                      <span className={styles["details-value"]}>
                        {totalProducts || 0}
                      </span>
                      <span className={styles["details-value"]}>
                        ₹ {totalRevenue || 0}
                      </span>
                    </div>
                    <div className={styles["details-text-container"]}>
                      <span className={styles["details-text"]}>
                        Last 7 days
                      </span>
                      <span className={styles["details-text"]}>Revenue</span>
                    </div>
                  </div>
                  <div className={styles["line"]}></div>
                  <div className={styles["other-details"]}>
                    <p className={styles["details-heading"]}>Top Selling</p>
                    <div className={styles["details-value-container"]}>
                      <span className={styles["details-value"]}>
                        {topSelling || 0}
                      </span>
                      <span className={styles["details-value"]}>₹ 0</span>
                    </div>
                    <div className={styles["details-text-container"]}>
                      <span className={styles["details-text"]}>
                        Last 7 days
                      </span>
                      <span className={styles["details-text"]}>Cost</span>
                    </div>
                  </div>
                  <div className={styles["line"]}></div>
                  <div className={styles["other-details"]}>
                    <p className={styles["details-heading"]}>Low Stocks</p>
                    <div className={styles["details-value-container"]}>
                      <span className={styles["details-value"]}>
                        {lowStock || 0}
                      </span>
                      <span className={styles["details-value"]}>
                        {outOfStock || 0}
                      </span>
                    </div>
                    <div className={styles["details-text-container"]}>
                      <span className={styles["details-text"]}>Ordered</span>
                      <span className={styles["details-text"]}>
                        Not in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles["products"]}>
                <div className={styles["text-button-container"]}>
                  <p>Products</p>
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => dispatch(setAddProductModal(true))}
                  >
                    Add Product
                  </button>
                </div>
                <table>
                  <thead>
                    <th>Products</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Threshold Value</th>
                    <th>Expiry Date</th>
                    <th>Availability</th>
                  </thead>
                  <tbody>
                    {pagination.products &&
                      pagination.products.map((product, index) => {
                        return (
                          <tr
                            onClick={() => {
                              dispatch(setOrderModal(true));
                              dispatch(setProductID(product._id));
                            }}
                            key={product._id}
                          >
                            <td>{product.productName}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.thresholdValue}</td>
                            <td>{formatDateToDDMMYY(product.expiryDate)}</td>
                            <td>
                              {product.availability === "In-stock" ? (
                                <span className={styles.inStock}>
                                  {product.availability}
                                </span>
                              ) : product.availability === "out-of-stock" ? (
                                <span className={styles.outOfStock}>
                                  {product.availability}
                                </span>
                              ) : product.availability === "expired" ? (
                                <span className={styles.expired}>
                                  {product.availability}
                                </span>
                              ) : (
                                <span className={styles.lowStock}>
                                  {product.availability}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div className={styles["pagination"]}>
                  <button
                  disabled={!pagination.hasPrevPage}
                    style={{ cursor: "pointer" }}
                    type="button"
                    onClick={() => getPageInfo(pagination.currentPage - 1)}
                  >
                    Previous
                  </button>
                  <p>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                  <button
                  disabled={!pagination.hasNextPage}
                    style={{ cursor: "pointer" }}
                    type="button"
                    onClick={() => getPageInfo(pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </div> 
              </div>

              
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Product;


