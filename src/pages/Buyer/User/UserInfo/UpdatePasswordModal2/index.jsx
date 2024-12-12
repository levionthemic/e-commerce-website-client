import { memo, useState } from "react";
import { CustomModal } from "../style";
import { useSelector, useDispatch } from "react-redux";
import {
  closeModal2,
  openModal1,
  openModal3,
} from "../../../../../redux/slices/UpdatePasswordModalSlice";
import img from "../../../../../assets/images/lock-icon.svg";
import img2 from "../../../../../assets/images/goback-icon.svg";
import "./UpdatePasswordModal2.scss";
import Swal from "sweetalert2";
import { axiosApi } from "../../../../../services/UserService";

function UpdatePasswordModal2() {
  const updatePasswordModal = useSelector(
    (state) => state.updatePasswordModal.modal2
  );
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosApi
      .post("/api/v1/user/otp-check", {
        otp: otp,
      })
      .then(() => {
        dispatch(closeModal2());
        dispatch(openModal3());
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
          title: error.response.data.message,
        });
      });
  };

  const handleResendOTP = (e) => {
    const token = localStorage.getItem("token");
    let email = "";
    axiosApi
      .get(`/api/v1/user/${token}`)
      .then((res) => {
        email = res.data.user.email;
      })
      .then(() => {
        axiosApi
          .post("/api/v1/user/otp-request", {
            email: email,
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
              icon: "info",
              title: "Đã gửi lại OTP!",
            });
          })
          .catch(() => {
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
              title: "Không gửi được OTP!",
            });
          });
      });
  };
  return (
    <>
      <CustomModal
        open={updatePasswordModal}
        onOk={() => dispatch(closeModal2())}
        onCancel={() => dispatch(closeModal2())}
        width={400}
        footer={null}
        closeIcon={null}
      >
        <div className="inner-wrap-modal-2">
          <div
            className="inner-goback"
            onClick={() => {
              dispatch(closeModal2());
              dispatch(openModal1());
            }}
          >
            <img src={img2} alt="" />
          </div>
          <div className="inner-title">
            <h4>Cập nhật mật khẩu</h4>
            <img src={img} alt="" />
          </div>
          <div className="inner-desc">
            <p>
              Vui lòng nhập OTP được gửi đến Email mới để cập nhật mật khẩu.
            </p>
          </div>
          <div className="inner-form">
            <form action="" onSubmit={handleSubmit}>
              <input
                type="tel"
                className="form-control"
                placeholder="Nhập OTP"
                maxLength={6}
                pattern="[0-9]{6}"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                value={otp}
                required
              />
              <div className="inner-buttons">
                <button type="submit" className="btn">
                  Tiếp theo
                </button>
                <button type="button" className="btn" onClick={handleResendOTP}>
                  Gửi lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default memo(UpdatePasswordModal2);
