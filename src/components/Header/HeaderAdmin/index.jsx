import { memo } from "react";
import "./HeaderAdmin.scss";
import Swal from "sweetalert2";

function HeaderAdmin() {
  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("token"); 
        window.location.reload();
      }
    });
  };
  return (
    <>
      <div className="header-admin">
        <i
          className="fa-solid fa-arrow-right-from-bracket"
          onClick={handleLogout}
        ></i>
      </div>
    </>
  );
}

export default memo(HeaderAdmin);
