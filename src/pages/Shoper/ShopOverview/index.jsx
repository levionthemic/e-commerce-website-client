import React, { useEffect, useState } from "react";
import "./ShopOverview.css";
import { axiosApi } from "../../../services/UserService";

const ShopOverview = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosApi.get("/api/v1/seller/product")
      .then(res => {
        setProducts(res.data.products);
      })
  }, []);

  useEffect(() => {
    axiosApi.get("/api/v1/seller/order")
      .then(res => {
        setOrders(res.data.orders);
      })
  }, []);

  const statistics = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + order.total_price, 0),
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    cancelledOrders: orders.filter((order) => order.status === "cancelled").length,
    bestSellingProduct: products?.sort((a, b) => b.quantity_sold.value - a.quantity_sold.value)[0]?.name,
  };

  return (
    <div className="shop-overview">
      <div className="overview-header">
        <h2>Tổng quan</h2>
      </div>
      <div className="overview-cards">
        <div className="overview-card">
          <h3>Tổng Số Sản Phẩm</h3>
          <p>{statistics.totalProducts}</p>
        </div>

        <div className="overview-card">
          <h3>Tổng Doanh Thu</h3>
          <p>{statistics.totalRevenue.toLocaleString()}<sup>đ</sup></p>
        </div>

        <div className="overview-card">
          <h3>Sản Phẩm Bán Chạy Nhất</h3>
          <p style={{ fontSize: "14px"}}>{statistics.bestSellingProduct}</p>
        </div>

        <div className="overview-card">
          <h3>Tổng Số Đơn Hàng</h3>
          <p>{statistics.totalOrders}</p>
        </div>

        <div className="overview-card">
          <h3>Đơn Hàng Chờ Xử Lý</h3>
          <p>{statistics.pendingOrders}</p>
        </div>

        
        
        <div className="overview-card">
          <h3>Đơn Hàng Đã Hủy</h3>
          <p>{statistics.cancelledOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default ShopOverview;
