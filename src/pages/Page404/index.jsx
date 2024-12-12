import { Result } from "antd";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
      extra={<Link to={"/"}>Trở lại trang chủ</Link>}
    />
  );
}

export default Page404;
