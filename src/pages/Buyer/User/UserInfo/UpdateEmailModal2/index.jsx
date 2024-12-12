import { memo, useState } from "react";
import { CustomModal } from "../style";
import { useSelector, useDispatch } from "react-redux";
import img from "../../../../../assets/images/email-icon.svg";
import img2 from "../../../../../assets/images/goback-icon.svg";
import "./UpdateEmailModal2.scss";
import Swal from "sweetalert2";
import {
  closeEmailModal2,
  openEmailModal1,
  openEmailModal3,
} from "../../../../../redux/slices/UpdateEmailModalSlice";
import { axiosApi } from "../../../../../services/UserService";

function UpdateEmailModal2() {
  const updateEmailModal = useSelector(
    (state) => state.updateEmailModal.modal2
  );
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosApi
      .post("/api/v1/user/otp-request", {
        newEmail: email,
      })
      .then(() => {
        dispatch(closeEmailModal2());
        dispatch(openEmailModal3(email));
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
  };

  return (
    <>
      <CustomModal
        open={updateEmailModal}
        onOk={() => dispatch(closeEmailModal2())}
        onCancel={() => dispatch(closeEmailModal2())}
        width={400}
        footer={null}
        closeIcon={null}
      >
        <div className="inner-wrap-modal-2">
          <div
            className="inner-goback"
            onClick={() => {
              dispatch(closeEmailModal2());
              dispatch(openEmailModal1());
            }}
          >
            <img src={img2} alt="" />
          </div>
          <div className="inner-title">
            <h4>Cập nhật Email</h4>
            <img src={img} alt="" />
          </div>
          <div className="inner-desc">
            <p>Vui lòng nhập Email mới</p>
          </div>
          <div className="inner-form">
            <form action="" onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập Email mới"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button type="submit" className="btn">
                Tiếp theo
              </button>
            </form>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default memo(UpdateEmailModal2);
