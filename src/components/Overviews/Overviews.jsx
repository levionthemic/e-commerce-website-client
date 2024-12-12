import React, { useState, useEffect } from 'react';
import { FaBox, FaPlus, FaCheck, FaTimes, FaBarcode, FaListUl, FaStoreAlt, FaMoneyBillAlt, FaUsers, FaComment } from 'react-icons/fa';
//import { axiosApi } from '../../services/AdminService';
import "./Overviews.css";

const Overviews = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    successfulOrders: 0,
    failedOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalStores: 0,
    totalRevenue: 0,
    totalComments: 0
  });

  useEffect(() => {
    // Giả sử gọi API để lấy dữ liệu thống kê
    fetch('http://localhost:3001/api/v1/admin/product')
      .then(response => response.json())
      .then(data => {
        const totalProducts = data.totalProducts;

        setStats(prevStats => ({
          ...prevStats,
          totalProducts,
        }));
      })
      .catch(error => console.error('Error fetching overview data:', error));
  }, []);
  useEffect(() => {
    // Giả sử gọi API để lấy dữ liệu thống kê
    fetch('http://localhost:3001/api/v1/admin/category')
      .then(response => response.json())
      .then(data => {
  
        const totalCategories = data.data.length;
  
        setStats(prevStats => ({
          ...prevStats,
          totalCategories,
        }));
      })
      .catch(error => console.error('Error fetching category data:', error));
  }, []);
  useEffect(() => {
    // Giả sử gọi API để lấy dữ liệu thống kê
    fetch('http://localhost:3001/api/v1/admin/user')
      .then(response => response.json())
      .then(data => {
        console.log("Dữ liệu API:", data);
  
        const totalUsers = data.data.length;
  
        // Cập nhật lại state với totalCategorys
        setStats(prevStats => ({
          ...prevStats,
          totalUsers,
        }));
      })
      .catch(error => console.error('Error fetching category data:', error));
  }, []);
  

  return (
    <div className="row" style={{ backgroundColor: '#7FFFD4' }}>
      {/* Hộp số 1: Tổng Đơn Hàng */}
      <div className="col-md-4 mb-3">
        <div className="card overview-card" style={{ width: '380px', height: '300px' }}>
          <div className="card-body">
            <h5 className="card-title">Đơn Hàng</h5>
            <div className="row">
              {/* Ô 1: Tổng đơn hàng */}
              <div className="col-6 mb-3">
                <div className="stat-box bg-beige">
                  <div className="icon-box bg-pink">
                    <FaBox size={24} color="white" />
                  </div>
                  <p className="card-text"><strong>Tổng đơn hàng:</strong> {stats.totalOrders}</p>
                </div>
              </div>
              {/* Ô 2: Đơn hàng mới */}
              <div className="col-6 mb-3">
                <div className="stat-box bg-beige">
                  <div className="icon-box bg-primary">
                    <FaPlus size={24} color="white" />
                  </div>
                  <p className="card-text"><strong>Đơn mới:</strong> {stats.newOrders}</p>
                </div>
              </div>
            </div>
            <div className="row">
              {/* Ô 3: Đơn thành công */}
              <div className="col-6 mb-3">
                <div className="stat-box bg-beige">
                  <div className="icon-box bg-green">
                    <FaCheck size={24} color="white" />
                  </div>
                  <p className="card-text"><strong>Đơn thành công:</strong> {stats.successfulOrders}</p>
                </div>
              </div>
              {/* Ô 4: Đơn bị hủy */}
              <div className="col-6 mb-3">
                <div className="stat-box bg-beige">
                  <div className="icon-box bg-danger">
                    <FaTimes size={24} color="white" />
                  </div>
                  <p className="card-text"><strong>Đơn bị hủy:</strong> {stats.failedOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các hộp khác */}
      {/* Hộp số 2: Chưa Cập Nhật */}
      <div className="col-md-8 mb-3">
        <div className="card" style={{ width: '800px', height: '300px' }}>
          <div className="card-body">
            <h5 className="card-title">Chưa Cập Nhật</h5>
            <p className="card-text">Hộp này dành cho mục khác (ví dụ: thống kê đơn hàng hoặc báo cáo khác).</p>
          </div>
        </div>
      </div>

      {/* Hộp số 3: Tổng sản phẩm và Danh mục sản phẩm */}
      <div className="col-md-4 mb-3">
        <div className="card" style={{ width: '380px', height: '300px' }}>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="stat-box-3 bg-beige mb-3">
              <div className="icon-box bg-green">
                <FaBarcode size={24} color="white"/>
              </div>
              <p className="card-text"><strong>Tổng sản phẩm:</strong> {stats.totalProducts}</p>
            </div>
            <div className="stat-box-3 bg-beige mb-3">
            <div className="icon-box bg-blue">
                <FaListUl size={24} color="white"/>
              </div>
              <p className="card-text"><strong>Danh mục sản phẩm:</strong> {stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Hộp số 4: Số lượng shop và Doanh thu */}
      <div className="col-md-4 mb-3">
        <div className="card" style={{ width: '380px', height: '300px' }}>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="stat-box-3 bg-beige mb-3">
            <div className="icon-box bg-red">
                <FaStoreAlt size={24} color="white"/>
              </div>
              <p className="card-text"><strong>Số lượng shop:</strong> {stats.totalStores}</p>
            </div>
            <div className="stat-box-3 bg-beige mb-3">
            <div className="icon-box bg-money">
                <FaMoneyBillAlt size={24} color="white"/>
              </div>
              <p className="card-text"><strong>Doanh thu:</strong> {stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hộp số 5: Số lượng khách hàng và Bình luận */}
      <div className="col-md-4 mb-3">
        <div className="card" style={{ width: '380px', height: '300px' }}>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="stat-box-3 bg-beige mb-3">
              <div className="icon-box bg-money">
                <FaUsers size={24} color="white"/>
              </div>
              <p className="card-text"><strong>Số lượng người dùng:</strong> {stats.totalUsers}</p>
            </div>
            <div className="stat-box-3 bg-beige mb-3">
              <div className="icon-box bg-pink">
                <FaComment size={24} color="white"/>
              </div>
              <p className="card-text"><strong>Bình luận/Đánh giá:</strong> {stats.totalComments}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overviews;
