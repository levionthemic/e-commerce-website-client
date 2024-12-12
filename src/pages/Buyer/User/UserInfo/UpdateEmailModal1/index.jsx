import { memo, useState } from "react";
import { CustomModal } from "../style";
import { useSelector, useDispatch } from "react-redux";
import img from "../../../../../assets/images/email-icon.svg";
import "./UpdateEmailModal1.scss";
import Swal from "sweetalert2";
import {
  closeEmailModal1,
  openEmailModal2,
} from "../../../../../redux/slices/UpdateEmailModalSlice";
import CryptoJS from "crypto-js";
import { axiosApi } from "../../../../../services/UserService";

function UpdateEmailModal1() {
  const updateEmailModal = useSelector(
    (state) => state.updateEmailModal.modal1
  );
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    axiosApi.get("/api/v1/user/" + token).then((res) => {
      const userPassword = res.data.user.password;
      const bytes = CryptoJS.AES.decrypt(userPassword, "secretkey");
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedPassword !== password) {
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
          title: "Sai mật khẩu!",
        });
      } else {
        dispatch(closeEmailModal1());
        dispatch(openEmailModal2());
      }
    });
  };

  return (
    <>
      <CustomModal
        open={updateEmailModal}
        onOk={() => dispatch(closeEmailModal1())}
        onCancel={() => dispatch(closeEmailModal1())}
        width={400}
        footer={null}
        closeIcon={null}
      >
        <div className="inner-wrap-modal-1">
          <div className="inner-title">
            <h4>Cập nhật Email</h4>
            <img src={img} alt="" />
          </div>
          <div className="inner-desc">
            <p>Vui lòng nhập mật khẩu để thay đổi Email</p>
          </div>
          <div className="inner-form">
            <form action="" onSubmit={handleSubmit}>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
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

export default memo(UpdateEmailModal1);
