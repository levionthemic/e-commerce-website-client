// src/pages/Login/Login.jsx
import React, { memo, useState } from "react";
import "./Signup.scss";
import img from "../../../assets/images/image-login.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { axiosApi } from "../../../services/UserService";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Mật khẩu không khớp!",
      });
      return;
    }
    // const role = e.target[0].checked ? "buyer" : "seller";
    const role = "buyer";

    try {
      await axiosApi.post("/api/v1/user/signup", {
        email: email,
        username: username,
        password: password,
        role: role,
      });
      Swal.fire({
        icon: "success",
        title: "Đăng kí thành công!",
        text: "Vui lòng đăng nhập để tiếp tục",
      });
      navigate("/auth/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại!",
        text: "Username hoặc email đã tồn tại!",
      });
    }
  };

  return (
    <>
      <div className="box-signup">
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
              <h3>Đăng ký</h3>
            </div>
            <div className="inner-form">
              <form action="" onSubmit={handleSubmit}>
                <div className="btn-group" role="group">
                  <div className="options">
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="buyer"
                      autoComplete="off"
                      required
                      checked
                      readOnly
                    />
                    <label className="btn btn-outline-primary" htmlFor="buyer">
                      Người mua
                    </label>
                  </div>
                  {/* <div className="options">
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="seller"
                      autoComplete="off"
                      required
                    />
                    <label className="btn btn-outline-primary" htmlFor="seller">
                      Người bán
                    </label>
                  </div> */}
                </div>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tài khoản"
                  onChange={handleChangeUsername}
                  value={username}
                  required
                  autoComplete="off"
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                  required
                  onChange={handleChangeEmail}
                  value={email}
                  autoComplete="off"
                />

                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  onChange={handleChangePassword}
                  value={password}
                  required
                  autoComplete="off"
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Xác nhận mật khẩu"
                  onChange={handleChangeConfirmPassword}
                  value={confirmPassword}
                  required
                  autoComplete="off"
                />
                <button type="submit" className="btn">
                  Xác nhận
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

export default memo(Signup);
