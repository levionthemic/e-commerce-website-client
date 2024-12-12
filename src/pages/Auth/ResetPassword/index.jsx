import { memo, useState } from "react";
import "./ResetPassword.scss";
import img from "../../../assets/images/image-login.jpg";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { axiosApi } from "../../../services/UserService";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Mật khẩu không khớp!",
      });
      return;
    }

    axiosApi
      .patch("/api/v1/user/reset-password", {
        password: password,
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Đặt lại mật khẩu thành công!",
          text: "Vui lòng đăng nhập lại để tiếp tục",
        });
        localStorage.removeItem("token");
        navigate("/auth/login");
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
              <h3>Cập nhật mật khẩu</h3>
            </div>
            <div className="inner-form">
              <form action="" onSubmit={handleSubmit}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Xác nhận mật khẩu"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
                <button type="submit" className="btn">
                  Cập nhật
                </button>
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

export default memo(ResetPassword);
