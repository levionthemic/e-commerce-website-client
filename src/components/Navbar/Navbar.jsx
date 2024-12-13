import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/images/AniCart.png";
import "./Navbar.css";
import { Dropdown, Button, Badge } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { axiosApi } from "../../services/UserService";
import { setCartQuantity } from "../../redux/slices/cartSlice";

function Navbar() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const cartQuantity = useSelector((state) => state.cart.quantity);
  const dispatch = useDispatch();

  const items = [
    {
      label: <Link to="/user/info">Tài khoản của tôi</Link>,
      key: "0",
    },
    {
      label: <Link to="/user/order">Đơn hàng của tôi</Link>,
      key: "1",
    },
    {
      label: <Link to="/settings">Cài đặt</Link>,
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: (
        <span
          style={{ color: "red", fontWeight: "bold" }}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
            navigate("/auth/login");
          }}
        >
          Đăng xuất
        </span>
      ),
      key: "3",
    },
  ];

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${searchKeyword.trim()}&page=1`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.href = "/";
  };

  useEffect(() => {
    axiosApi
      .get("api/v1/cart/" + localStorage.getItem("cartId"))
      .then((res) => {
        const quantity = res.data.data.length;
        dispatch(setCartQuantity(quantity));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={handleLogoClick}>
            <img src={logo} alt="E-shop" />
          </Link>
        </div>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress} // Bắt sự kiện nhấn phím
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="ant-btn"
            onClick={handleSearch} // Bắt sự kiện khi nhấn nút tìm kiếm
          />
        </div>
        <div className="right">
          {/* Liên kết tới trang giỏ hàng */}
          <Link to="/cart" className="icon">
            <Badge count={cartQuantity} showZero size="small">
              <ShoppingCartOutlined className="icon" />
            </Badge>
          </Link>
          {/* Menu người dùng */}
          <Dropdown menu={{ items }} trigger={["click"]}>
            <span className="icon" onClick={(e) => e.preventDefault()}>
              <UserOutlined />
            </span>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);
