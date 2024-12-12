import { memo, useEffect, useState } from "react";
import {
  Avatar,
  DatePicker,
  Radio,
  Spin,
  Tooltip,
  Upload,
  message,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  RestOutlined,
} from "@ant-design/icons";
import "./UserInfo.scss";
import avatar from "../../../../assets/images/avatar.svg";
import icon from "../../../../assets/images/icon.svg";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { openModal1 } from "../../../../redux/slices/UpdatePasswordModalSlice";
import { openEmailModal1 } from "../../../../redux/slices/UpdateEmailModalSlice";
import UpdatePasswordModal1 from "./UpdatePasswordModal1";
import UpdatePasswordModal2 from "./UpdatePasswordModal2";
import UpdatePasswordModal3 from "./UpdatePasswordModal3";
import UpdateEmailModal1 from "./UpdateEmailModal1";
import UpdateEmailModal3 from "./UpdateEmailModal3";
import UpdateEmailModal2 from "./UpdateEmailModal2";
import { axiosApi } from "../../../../services/UserService";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function UserInfo() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    fullname: "",
    nickname: "",
    birthday: "",
    sex: "",
    nationality: "",
  });
  const [nations, setNations] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState();
  const [isUploadImage, setIsUploadImage] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    axiosApi.get("/api/v1/user/nations").then((res) => {
      setNations(res.data.data);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axiosApi.get(`/api/v1/user/${token}`).then((res) => {
      setUser(res.data.user);
      setImageUrl(res.data.user.avatar);
    });
  }, []);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/upload`,
        {
          method: "post",
          body: formData,
        }
      );
      const data = await res.json();
      message.success("Upload successful");
      return data.secure_url;
    } catch (error) {
      message.error("Upload failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      title: "Cảnh báo!",
      text: "Bạn có chắc chắn muốn cập nhật?",
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    }).then(async (res) => {
      if (res.isConfirmed) {
        setLoading(true);

        let bodyApi = { ...user };
        if (isUploadImage) {
          const imgUrl = await uploadImage();
          bodyApi.avatar = imgUrl;
        }

        axiosApi
          .patch("/api/v1/user/update", bodyApi)
          .then((res) => {
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "Thành công!",
              text: res.data.message,
              didClose: () => {
                window.location.reload();
              },
            });
          })
          .catch((error) => {
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Lỗi!",
              text: error.response.data.message,
            });
          });
      }
    });
  };

  const handleUpdatePhoneNumber = () => {
    Swal.fire({
      title: "Nhập số điện thoại: ",
      input: "tel",
      inputAttributes: {
        maxlength: "10",
        pattern: "[0-9]{10}",
        required: true,
        placeholder: "Cần nhập 10 chữ số",
      },
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy bỏ",
      showLoaderOnConfirm: true,
      preConfirm: async (phoneNumber) => {
        Swal.fire({
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: true,
          title: "Cảnh báo!",
          text: "Bạn có chắc chắn muốn cập nhật?",
          confirmButtonText: "Cập nhật",
          cancelButtonText: "Hủy",
        }).then((res) => {
          if (res.isConfirmed) {
            axiosApi
              .patch("/api/v1/user/update", {
                phoneNumber: phoneNumber,
              })
              .then((res) => {
                Swal.fire({
                  icon: "success",
                  title: "Thành công!",
                  text: res.data.message,
                  didClose: () => {
                    window.location.reload();
                  },
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Lỗi!",
                  text: error.response.data.message,
                });
              });
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };
  const handleUpdateAddress = () => {
    Swal.fire({
      title: "Nhập địa chỉ: ",
      input: "text",
      inputAttributes: {
        required: true,
      },
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy bỏ",
      showLoaderOnConfirm: true,
      preConfirm: async (address) => {
        Swal.fire({
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: true,
          title: "Cảnh báo!",
          text: "Bạn có chắc chắn muốn cập nhật?",
          confirmButtonText: "Cập nhật",
          cancelButtonText: "Hủy",
        }).then((res) => {
          if (res.isConfirmed) {
            axiosApi
              .patch("/api/v1/user/update", {
                address: address,
              })
              .then((res) => {
                Swal.fire({
                  icon: "success",
                  title: "Thành công!",
                  text: res.data.message,
                  didClose: () => {
                    window.location.reload();
                  },
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Lỗi!",
                  text: error.response.data.message,
                });
              });
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleUpdatePassword = () => {
    dispatch(openModal1());
  };

  const handleUpdateEmail = () => {
    dispatch(openEmailModal1());
  };

  const handleClick = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      icon: "info",
      title: "Tính năng chưa được hoàn thiện!",
    });
  };

  const handleUpload = (file) => {
    setImageFile(file);
    setIsUploadImage(true);
    setHasUpdated(true);
    getBase64(file, (url) => {
      setImageUrl(url);
    });
  };

  return (
    <>
      <div className="container">
        <div className="row mt-5 mb-2">
          <div className="col-12">
            <h3>Thông tin tài khoản</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="inner-wrap-user-info">
              <div className="inner-left-content">
                <Spin spinning={loading} tip="Đang cập nhật...">
                  <h5 className="mb-4">Thông tin cá nhân</h5>
                  <form action="#" onSubmit={handleSubmit}>
                    <div className="form-section-1">
                      <div className="inner-avatar">
                        <Tooltip title="Click để upload ảnh" placement="rightTop">
                          <Upload
                            showUploadList={false}
                            customRequest={({ file }) => handleUpload(file)}
                            beforeUpload={beforeUpload}
                          >
                            {imageUrl ? (
                              <Avatar
                                size={130}
                                src={imageUrl}
                                style={{ border: "1px solid #ddd" }}
                              />
                            ) : (
                              <div className="inner-placeholder-avatar">
                                <img src={avatar} alt="" />
                                <img src={icon} alt="" />
                              </div>
                            )}
                          </Upload>
                        </Tooltip>
                      </div>
                      <div className="inner-info">
                        <div className="form-group">
                          <label htmlFor="fullname">Họ và tên</label>
                          <input
                            type="text"
                            className="form-control"
                            value={user.fullname}
                            id="fullname"
                            onChange={(e) => {
                              const newUser = { ...user };
                              newUser.fullname = e.target.value;
                              setUser(newUser);
                              setHasUpdated(true);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="nickname">Biệt danh</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={"Thêm biệt danh"}
                            id="nickname"
                            value={user.nickname}
                            onChange={(e) => {
                              const newUser = { ...user };
                              newUser.nickname = e.target.value;
                              setUser(newUser);
                              setHasUpdated(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section-2">
                      <div className="form-group">
                        <label htmlFor="birthday">Ngày sinh</label>
                        <DatePicker
                          picker="date"
                          format="DD/MM/YYYY"
                          value={dayjs(user.birthday)}
                          onChange={(e) => {
                            const newUser = { ...user };
                            newUser.birthday = e.format("MM/DD/YYYY");
                            setUser(newUser);
                            setHasUpdated(true);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sex">Giới tính</label>
                        <Radio.Group
                          value={user.sex}
                          onChange={(e) => {
                            const newUser = { ...user };
                            newUser.sex = e.target.value;
                            setUser(newUser);
                            setHasUpdated(true);
                          }}
                        >
                          <Radio value={"male"}>Nam</Radio>
                          <Radio value={"female"}>Nữ</Radio>
                          <Radio value={"other"}>Khác</Radio>
                        </Radio.Group>
                      </div>
                      <div className="form-group">
                        <label htmlFor="nationality">Quốc tịch</label>
                        <select
                          className="form-select"
                          id="nationality"
                          value={user.nationality}
                          onChange={(e) => {
                            const newUser = { ...user };
                            newUser.nationality = e.target.value;
                            setUser(newUser);
                            setHasUpdated(true);
                          }}
                        >
                          <option selected disabled>
                            -- Chọn quốc tịch --
                          </option>
                          {nations.length ? (
                            <>
                              {nations.map((item) => (
                                <option
                                  value={item.num_code}
                                  key={item.num_code}
                                  selected={item.num_code === user.nationality}
                                >
                                  {item.en_short_name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn"
                        disabled={!hasUpdated}
                      >
                        Cập nhật thay đổi
                      </button>
                    </div>
                  </form>
                </Spin>
              </div>

              <div className="inner-right-content">
                <div className="section-1">
                  <h5>Số điện thoại và Email</h5>
                  <div className="inner-item">
                    <div className="inner-item-info">
                      <div className="inner-icon">
                        <PhoneOutlined
                          style={{ transform: "rotateY(180deg)" }}
                        />
                      </div>
                      <div className="inner-content">
                        <h6>Số điện thoại</h6>
                        <p>{user.phoneNumber || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div className="inner-button">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleUpdatePhoneNumber}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                  <div className="inner-item">
                    <div className="inner-item-info">
                      <div className="inner-icon">
                        <MailOutlined />
                      </div>
                      <div className="inner-content">
                        <h6>Địa chỉ Email</h6>
                        <p>{user.email || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div className="inner-button">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleUpdateEmail}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                  <UpdateEmailModal1 />
                  <UpdateEmailModal2 />
                  <UpdateEmailModal3 />
                </div>

                <div className="section-2">
                  <h5>Bảo mật</h5>
                  <div className="inner-item">
                    <div className="inner-item-info">
                      <div className="inner-icon">
                        <LockOutlined />
                      </div>
                      <div className="inner-content">
                        <p>Thiết lập mật khẩu</p>
                      </div>
                    </div>
                    <div className="inner-button">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleUpdatePassword}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                  <UpdatePasswordModal1 />
                  <UpdatePasswordModal2 />
                  <UpdatePasswordModal3 />
                  <div className="inner-item">
                    <div className="inner-item-info">
                      <div className="inner-icon">
                        <RestOutlined />
                      </div>
                      <div className="inner-content">
                        <p>Yêu cầu xóa tài khoản</p>
                      </div>
                    </div>
                    <div className="inner-button">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleClick}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>

                <div className="section-3">
                  <h5>Địa chỉ</h5>
                  <div className="inner-item">
                    <div className="inner-item-info inner-address">
                      <p>{user.address || "Chưa cập nhật"}</p>
                    </div>
                    <div className="inner-button">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleUpdateAddress}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(UserInfo);
