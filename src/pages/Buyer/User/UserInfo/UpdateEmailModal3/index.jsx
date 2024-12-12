import { memo, useState } from "react";
import { CustomModal } from "../style";
import { useSelector, useDispatch } from "react-redux";
import img from "../../../../../assets/images/email-icon.svg";
import img2 from "../../../../../assets/images/goback-icon.svg";
import "./UpdateEmailModal3.scss";
import Swal from "sweetalert2";
import {
  closeEmailModal3,
  openEmailModal2,
} from "../../../../../redux/slices/UpdateEmailModalSlice";
import { axiosApi } from "../../../../../services/UserService";

function UpdateEmailModal3() {
  const updateEmailModal = useSelector(
    (state) => state.updateEmailModal.modal3
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
        console.log(updateEmailModal.email);
        axiosApi
          .patch("/api/v1/user/update", {
            email: updateEmailModal.email,
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
              title: "Cập nhật email thành công!",
            });
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
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
          .then((res) => {
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
              title: "Không gửi được OTP!",
            });
          });
      });
  };

  return (
    <>
      <CustomModal
        open={updateEmailModal.value}
        onOk={() => dispatch(closeEmailModal3())}
        onCancel={() => dispatch(closeEmailModal3())}
        width={400}
        footer={null}
        closeIcon={null}
      >
        <div className="inner-wrap-modal-3">
          <div
            className="inner-goback"
            onClick={() => {
              dispatch(closeEmailModal3());
              dispatch(openEmailModal2());
            }}
          >
            <img src={img2} alt="" />
          </div>
          <div className="inner-title">
            <h4>Cập nhật Email</h4>
            <img src={img} alt="" />
          </div>
          <div className="inner-desc">
            <p>
              Vui lòng nhập OTP được gửi đến Email mới để hoàn tất thay đổi.
            </p>
          </div>
          <div className="inner-form">
            <form action="" onSubmit={handleSubmit}>
              <input
                type="tel"
                className="form-control"
                placeholder="Nhập OTP"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
              <div className="inner-buttons">
                <button type="submit" className="btn">
                  Xác nhận
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

export default memo(UpdateEmailModal3);
