import { memo, useEffect, useState } from "react";
import "./SiderSeller.css";
import { FaHome, FaPlus, FaBox, FaShoppingCart, FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SiderSeller() {
  const navigate = useNavigate();
  const [navLinksActive, setNavLinksActive] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const pathname = new URL(window.location.href).pathname;
  const handleMenuClick = (tab) => {
    switch (tab) {
      case "overview":
        navigate("/shop/overview");
        break;
      case "add-product":
        navigate("/shop/products/add");
        break;
      case "manage-products":
        navigate("/shop/products");
        break;
      case "manage-orders":
        navigate("/shop/orders");
        break;
      case "profile":
        navigate("/shop/profile");
        break;
      case "logout":
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn có chắc chắn muốn đăng xuất?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Đăng xuất",
          cancelButtonText: "Hủy",
        }).then((res) => {
          if (res.isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.reload();
          }
        });

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const temp = [false, false, false, false, false];
    switch (pathname) {
      case "/shop/overview":
        temp[0] = true;
        break;
      case "/shop/products/add":
        temp[1] = true;
        break;
      case "/shop/products":
        temp[2] = true;
        break;
      case "/shop/orders":
        temp[3] = true;
        break;
      case "/shop/profile":
        temp[4] = true;
        break;

      default:
        break;
    }
    setNavLinksActive(temp);
  }, [pathname]);

  return (
    <div className="sidebar">
      <h2 className="text-center mb-4">seller</h2>
      <ul className="nav flex-column">
        {[
          { id: "overview", label: "Tổng quan", icon: <FaHome /> },
          { id: "add-product", label: "Thêm sản phẩm", icon: <FaPlus /> },
          {
            id: "manage-products",
            label: "Quản lý sản phẩm",
            icon: <FaBox />,
          },
          {
            id: "manage-orders",
            label: "Quản lý đơn hàng",
            icon: <FaShoppingCart />,
          },
          { id: "profile", label: "Hồ sơ cửa hàng", icon: <FaUser /> },
          { id: "logout", label: "Đăng xuất", icon: <IoLogOut /> },
        ].map((item, index) => (
          <li
            key={item.id}
            className={`nav-item`}
            onClick={() => handleMenuClick(item.id)}
          >
            <div
              className={
                "custom-nav-link " +
                (navLinksActive[index] ? "custom-active" : "")
              }
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(SiderSeller);
