import { memo, useState } from "react";
import "./OTPConfirm.scss";
import img from "../../../assets/images/image-login.jpg";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosApi } from "../../../services/UserService";

function OTPConfirm() {
  const navigate = useNavigate();
  const email = useLocation().state;
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosApi
      .post("/api/v1/user/otp-check", {
        otp: otp,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/auth/reset-password");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: error.response.data.message,
        });
      });
  };

  const handleResendOTP = (e) => {
    axiosApi
      .post("/api/v1/user/otp-request", {
        email: email,
      })
      .then((res) => {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Đã gửi lại OTP. Vui lòng kiểm tra trong email!",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: error.response.data.message,
        });
      });
  };

  return (
    <>
      <div className="box">
        <div className="inner-wrap">
          <div className="inner-content">
            <div
              className="inner-goback"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeftOutlined />
            </div>
            <div className="inner-title">
              <h3>Xác nhận OTP</h3>
              <p>Vui lòng nhập OTP để lấy lại mật khẩu</p>
            </div>
            <div className="inner-form">
              <form action="" onSubmit={handleSubmit}>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Nhập mã OTP"
                  name="email"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                  required
                />
                <div className="inner-buttons">
                  <button type="submit" className="btn">
                    Xác nhận
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleResendOTP}
                  >
                    Gửi lại OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="inner-image">
            <img src={img} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(OTPConfirm);
