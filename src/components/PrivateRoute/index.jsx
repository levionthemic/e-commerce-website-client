import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "./auth";
import { Result } from "antd";

const PrivateRoute = ({ children }) => {
  const auth = isAuthenticated();
  if (auth) {
    return <>{children}</>;
  }
  console.log(auth);
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
        extra={<Link to={"/auth/login"}>Trở lại trang đăng nhập</Link>}
      />
    </>
  );
};

export default PrivateRoute;
