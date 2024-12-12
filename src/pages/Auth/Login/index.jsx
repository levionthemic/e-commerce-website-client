// src/pages/Login/Login.jsx
import React, { useEffect, useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { axiosApi } from "../../../services/UserService";
import Swal from "sweetalert2";
import img from "../../../assets/images/image-login.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("role") === "buyer") {
        navigate("/");
      } else if (localStorage.getItem("role") === "seller") {
        navigate("/shop/overview");
      } else {
        navigate("/admin/account");
      }
    }
  }, []);

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleClick = () => {
    navigate("/auth/signup");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = e.target[0].checked
      ? "buyer"
      : e.target[1].checked
      ? "seller"
      : "admin";

    axiosApi
      .post("/api/v1/user/login", {
        username: username,
        password: password,
        role: role,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
        if (role === "buyer") {
          localStorage.setItem("cartId", res.data.cartId);
          navigate("/");
        } else if (role === "seller") {
          navigate("/shop/overview");
        } else {
          navigate("/admin/account");
        }
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Thất bại!",
          text: error.response.data.message,
        });
      });
  };

  return (
    <>
      <div className="box-login">
        <div className="inner-wrap">
          <div className="inner-content">
            <div className="inner-title">
              <h3>Đăng nhập</h3>
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
                    />
                    <label className="btn btn-outline-primary" htmlFor="buyer">
                      Người mua
                    </label>
                  </div>
                  <div className="options">
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
                  </div>
                  <div className="options">
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="admin"
                      autoComplete="off"
                      required
                    />
                    <label className="btn btn-outline-primary" htmlFor="admin">
                      Admin
                    </label>
                  </div>
                </div>

                <input
                  id="username"
                  type="text"
                  className="form-control"
                  placeholder="Tài khoản"
                  onChange={handleChangeUsername}
                  value={username}
                  required
                  autoComplete="off"
                />
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  onChange={handleChangePassword}
                  value={password}
                  required
                  autoComplete="off"
                />
                <div className="inner-buttons">
                  <button type="submit" className="btn">
                    Đăng nhập
                  </button>
                  <button type="button" onClick={handleClick} className="btn">
                    Đăng kí
                  </button>
                </div>
              </form>
              <div
                className="inner-forgot"
                onClick={() => {
                  navigate("/auth/forgot-password");
                }}
              >
                <span>Quên mật khẩu?</span>
              </div>
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

export default Login;
