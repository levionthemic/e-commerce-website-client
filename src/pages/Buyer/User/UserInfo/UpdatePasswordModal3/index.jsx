import { memo, useState } from "react";
import { CustomModal } from "../style";
import { useSelector, useDispatch } from "react-redux";
import {
  closeModal3,
  openModal2,
} from "../../../../../redux/slices/UpdatePasswordModalSlice";
import img from "../../../../../assets/images/lock-icon.svg";
import img2 from "../../../../../assets/images/goback-icon.svg";
import "./UpdatePasswordModal3.scss";
import Swal from "sweetalert2";
import { axiosApi } from "../../../../../services/UserService";

function UpdatePasswordModal3() {
  const updatePasswordModal = useSelector(
    (state) => state.updatePasswordModal.modal3
  );
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        icon: "error",
        title: "Mật khẩu xác nhận không trùng khớp",
      });
      return;
    }

    axiosApi
      .patch("/api/v1/user/reset-password", {
        password: password,
      })
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
          icon: "success",
          title: "Cập nhật mật khẩu thành công!",
        });
        window.location.reload();
      })
      .catch((error) => {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
          icon: "error",
          title: "Lỗi!",
          text: error.response.data.message,
        });
      });
  };
  return (
    <>
      <CustomModal
        open={updatePasswordModal}
        onOk={() => dispatch(closeModal3())}
        onCancel={() => dispatch(closeModal3())}
        width={400}
        footer={null}
        closeIcon={null}
      >
        <div className="inner-wrap-modal-3">
          <div
            className="inner-goback"
            onClick={() => {
              dispatch(closeModal3());
              dispatch(openModal2());
            }}
          >
            <img src={img2} alt="" />
          </div>
          <div className="inner-title">
            <h4>Cập nhật mật khẩu</h4>
            <img src={img} alt="" />
          </div>
          <div className="inner-form">
            <form action="" onSubmit={handleSubmit}>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu mới"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Xác nhận mật khẩu"
                required
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />

              <button type="submit" className="btn">
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default memo(UpdatePasswordModal3);
