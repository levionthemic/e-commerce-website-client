import { memo, useEffect, useState } from "react";
import "./Checkout.scss";
import icon from "../../../assets/images/money-icon.svg";
import icon1 from "../../../assets/images/arrow-icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosApi } from "../../../services/UserService";
import Swal from "sweetalert2";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartList = location.state.cartList;

  const totalPrice = cartList.reduce(
    (sum, item) =>
      sum +
      item.quantity * item.original_price * (1 - item.discount_rate / 100),
    0
  );

  const [user, setUser] = useState({});
  const [isShow, setShow] = useState(false);

  const handleToggleShow = (e) => {
    const div = document.querySelector(".inner-section-4 .inner-products");
    const isShowed = !isShow;
    if (isShowed) {
      div.classList.add("show");
    } else {
      div.classList.remove("show");
    }
    const img = document
      .querySelector(".inner-quantity div:last-child")
      .querySelector("img");

    if (isShowed) {
      img.classList.remove("show");
    } else {
      img.classList.add("show");
    }

    setShow(!isShow);
  };

  const handleCheckout = () => {
    axiosApi
      .post("/api/v1/checkout/order", {
        cartId: localStorage.getItem("cartId"),
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Đặt hàng thành công!",
          text: "Vui lòng kiểm tra hóa đơn điện tử trong email của bạn",
          didClose: () => {
            navigate("/");
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axiosApi
      .get("/api/v1/user/" + localStorage.getItem("token"))
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="container">
        <div className="row mt-4 mb-2">
          <div className="col-12">
            <h3>Thanh toán</h3>
          </div>
        </div>
        <div className="row position-relative">
          <div className="col-9">
            <div className="inner-section inner-section-1">
              <h4>Chọn hình thức giao hàng</h4>
              <div className="inner-form-check">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="transfer-type"
                    id="type1"
                    checked
                  />
                  <label htmlFor="type1">Giao hàng tiết kiệm</label>
                </div>
                <div className="form-check form-check-disabled">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="transfer-type"
                    id="type2"
                    disabled
                  />
                  <label htmlFor="type2">Giao hàng nhanh</label>
                </div>
              </div>

              <div className="inner-order-list">
                {cartList.map((product) => (
                  <div className="inner-order">
                    <p>Giao vào chủ nhật 17/11</p>
                    <div className="inner-info">
                      <div className="inner-left">
                        <div className="inner-image">
                          <img src={product.thumbnail_url} alt="" />
                        </div>
                        <div className="inner-content">
                          <p>{product.name}</p>
                          <p>SL: x{product.quantity}</p>
                        </div>
                      </div>
                      <div className="inner-right">
                        <p>
                          {(
                            product.quantity *
                            product.original_price *
                            (1 - product.discount_rate / 100)
                          ).toLocaleString()}
                          <sup>đ</sup>
                        </p>
                      </div>
                    </div>
                    <div className="inner-price">
                      <p>Tiền vận chuyển: </p>
                      <p>32,123đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="inner-section inner-section-2">
              <h4>Chọn hình thức thanh toán</h4>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  readOnly
                  checked
                />
                <label htmlFor="pay-type">
                  <span>Thanh toán tiền mặt</span>
                  <img src={icon} alt="" />
                </label>
              </div>
            </div>
          </div>
          <div
            className="col-3"
            style={{
              position: "sticky",
              top: "100px",
              left: "0",
              height: "fit-content",
            }}
          >
            <div className="inner-section inner-section-3">
              <div className="inner-title">
                <h4>Giao tới</h4>
                <span
                  onClick={() => {
                    navigate("/user/info");
                  }}
                >
                  Thay đổi
                </span>
              </div>
              <div className="inner-content">
                <div className="inner-info">
                  <span>{user.fullname}</span>
                  <div className="divider"></div>
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="inner-address">{user.address}</div>
              </div>
            </div>
            <div className="inner-section inner-section-4">
              <div className="inner-title">
                <h4>Đơn hàng</h4>
                <span
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  Thay đổi
                </span>
              </div>
              <div className="inner-quantity">
                <span>{cartList.length} sản phẩm</span>
                <div onClick={handleToggleShow}>
                  <img className="show" src={icon1} alt="" />
                  {isShow ? "Thu gọn" : "Xem thông tin"}
                </div>
              </div>
              <div className="inner-products">
                <div className="inner-products-list">
                  {cartList.map((product) => (
                    <div className="inner-product">
                      <div>{product.quantity}</div>
                      <div>{product.name}</div>
                      <div>
                        {(
                          product.quantity *
                          product.original_price *
                          (1 - product.discount_rate / 100)
                        ).toLocaleString()}
                        <sup>đ</sup>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="inner-info-prices">
                <div className="inner-price">
                  <span>Tổng tiền hàng</span>
                  <span>
                    {totalPrice.toLocaleString()}
                    <sup>đ</sup>
                  </span>
                </div>
                <div className="inner-price">
                  <span>Phí vận chuyển</span>
                  <span>64,246đ</span>
                </div>
              </div>
              <div className="inner-price-total">
                <div>Tổng tiền thanh toán</div>
                <div>
                  {(totalPrice + 64246).toLocaleString()}
                  <sup>đ</sup>
                </div>
                <p>
                  (Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và
                  các chi phí phát sinh khác)
                </p>
              </div>
              <div className="inner-order-button">
                <button type="button" className="btn" onClick={handleCheckout}>
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Checkout);
