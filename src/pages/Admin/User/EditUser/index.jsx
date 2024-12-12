import React, { useState, memo } from "react";
import "./EditUser.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { DatePicker, Radio, Tooltip, Upload, message } from "antd";
import { axiosApi } from "../../../../services/UserService";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const EditUser = () => {
  const user = useLocation().state?.user;
  console.log(user);
  const navigate = useNavigate();

  const [fullname, setFullname] = useState(user?.fullname);
  const [nickname, setNickname] = useState(user?.nickname);
  const [birthday, setBirthday] = useState(user?.birthday || "01/01/1990");
  const [sex, setSex] = useState(user?.sex);
  const [address, setAddress] = useState(user?.address);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [role, setRole] = useState(user?.role);
  const [username, setUsername] = useState(user?.username);
  const [password, setPassword] = useState(user?.password);
  const [deleted, setDeleted] = useState(user?.deleted);

  const [imageUrl, setImageUrl] = useState();
  const [imageFile, setImageFile] = useState();

  const [isUploadImage, setIsUploadImage] = useState(false);

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

  const handleUpload = (file) => {
    setImageFile(file);
    setIsUploadImage(true);
    getBase64(file, (url) => {
      setImageUrl(url);
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "warning",
      title: "Cảnh báo",
      text: "Xác nhận cập nhật thông tin tài khoản?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (res) => {
      if (res.isConfirmed) {
        let imgUrl = "";
        if (isUploadImage) {
          imgUrl = await uploadImage();
        }

        axiosApi
          .patch("/api/v1/admin/user/edit", {
            avatar: imgUrl || user?.avatar,
            fullname: fullname,
            nickname: nickname,
            birthday: birthday,
            sex: sex,
            address: address,
            email: email,
            phoneNumber: phoneNumber,
            role: role,
            username: username,
            password: password,
            deleted: deleted,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Thành công!",
              text: res.data.message,
              didClose: () => {
                navigate(-1);
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
  };

  return (
    <div className="edit-user">
      <h3>Chỉnh sửa tài khoản</h3>
      <form action="" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="row mb-3">
              <div className="col-4">
                <div className="form-group">
                  <label>Ảnh đại diện</label>
                  <br></br>
                  <Tooltip title="Click để upload ảnh" placement="rightTop">
                    <Upload
                      showUploadList={false}
                      customRequest={({ file }) => handleUpload(file)}
                      beforeUpload={beforeUpload}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="product-image mx-5"
                        />
                      ) : (
                        <img src={user?.avatar} alt="" className="user-image" />
                      )}
                    </Upload>
                  </Tooltip>
                </div>
              </div>
              <div className="col-8">
                <div className="form-group mb-4">
                  <label>Họ và tên</label>
                  <input
                    className="form-control"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birthday">Ngày sinh</label>
                  <br></br>
                  <DatePicker
                    picker="date"
                    format="DD/MM/YYYY"
                    value={dayjs(birthday)}
                    onChange={(e) => {
                      setBirthday(e.format("MM/DD/YYYY"));
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <div className="form-group mb-3">
                  <label>Tên biệt danh:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên biệt danh"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="sex">Giới tính</label> <br></br>
                  <Radio.Group
                    value={sex}
                    onChange={(e) => {
                      setSex(e.target.value);
                    }}
                    required
                  >
                    <Radio value={"male"}>Nam</Radio>
                    <Radio value={"female"}>Nữ</Radio>
                    <Radio value={"other"}>Khác</Radio>
                  </Radio.Group>
                </div>

                <div className="form-group mb-3">
                  <label>Địa chỉ:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập địa chỉ"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Email: </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Số điện thoại: </label>
                  <input
                    type="tel"
                    maxLength={10}
                    minLength={10}
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    value={phoneNumber}
                    required
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="sex">Vai trò</label>
                  <Radio.Group
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                    }}
                    required
                  >
                    <Radio value={"buyer"}>Người mua</Radio>
                    <Radio value={"seller"}>Người bán</Radio>
                    <Radio value={"admin"}>Quản trị viên</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group mb-3">
                  <label>Username: </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Mật khẩu: </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="sex">Trạng thái</label> <br></br>
                  <Radio.Group
                    value={deleted}
                    onChange={(e) => {
                      setDeleted(e.target.value);
                    }}
                    required
                  >
                    <Radio value={true}>Đã khóa</Radio>
                    <Radio value={false}>Khả dụng</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>

            <div className="form-group button-action">
              <button type="submit" className="btn btn-primary">
                Cập nhật
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  navigate("/admin/user");
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(EditUser);