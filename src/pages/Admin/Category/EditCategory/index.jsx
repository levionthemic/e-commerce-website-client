import React, { useState, useEffect, memo } from "react";
import "./EditCategory.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Select, Spin, Tooltip, Upload, message } from "antd";
import { axiosApi } from "../../../../services/UserService";
import Swal from "sweetalert2";

const EditCategory = () => {
  const category = useLocation()?.state?.category;
  console.log(category);
  const navigate = useNavigate();

  const [text, setText] = useState(category?.name);
  const [id, setId] = useState(category?.id);
  const [sellerId, setSellerId] = useState(category?.seller_id);
  const [parentId, setParentId] = useState(category?.parentId);
  const [loading, setLoading] = useState(true);

  const [imageUrl, setImageUrl] = useState();
  const [imageFile, setImageFile] = useState();

  const [isUploadImage, setIsUploadImage] = useState(false);

  const [sellers, setSellers] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosApi("/api/v1/admin/user", { params: { role: "seller" } }).then(
      (res) => {
        setSellers(res.data.data);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosApi
      .get("/api/v1/admin/category/" + category.id)
      .then((res) => {
        setParentCategories(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [category.id]);

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
      text: "Xác nhận cập nhật thông tin danh mục?",
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
          .patch("/api/v1/admin/category/edit", {
            isParentCategory: category.isParentCategory,
            id: id,
            icon_url: imgUrl || category?.icon_url,
            text: text,
            seller_id: sellerId,
            parent_id: parentId
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

  let options = [];
  if (category?.isParentCategory) {
    options = sellers?.map((seller) => ({
      value: seller._id,
      label: seller.fullname,
    }));
  } else {
    console.log(parentCategories);
    options = parentCategories.map(category => ({
      value: category.id,
      label: category.name || category.text
    }));
  }
  return (
    <Spin spinning={loading} tip="Đang tải...">
      <div className="edit-category">
        <h3>Chỉnh sửa danh mục</h3>
        <form action="" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-3">
                  <div className="form-group mb-4">
                    <label htmlFor="id">Mã danh mục</label>
                    <input
                      className="form-control"
                      id="id"
                      value={id}
                      disabled
                      onChange={(e) => setId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-9">
                  <div className="form-group mb-4">
                    <label>Tên danh mục:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên danh mục"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  {category?.isParentCategory && (
                    <div className="form-group">
                      <label htmlFor="icon_url">Icon danh mục</label>
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
                            <img
                              src={category?.icon}
                              alt=""
                              className="category-image"
                            />
                          )}
                        </Upload>
                      </Tooltip>
                    </div>
                  )}
                </div>

                <div className="col-6">
                  {category?.isParentCategory ? (
                    <div className="form-group mb-4">
                      <label>Tên người bán:</label>
                      <br></br>
                      <Select
                        showSearch
                        defaultValue={category?.seller_id}
                        placeholder="Chọn tên người bán"
                        optionFilterProp="label"
                        onChange={(e) => {
                          setSellerId(e);
                        }}
                        options={options}
                      />
                    </div>
                  ) : (
                    <div className="form-group mb-4">
                      <label>Danh mục cha:</label>
                      <br></br>
                      <Select
                        showSearch
                        defaultValue={category.parentId}
                        placeholder="Chọn danh mục cha"
                        optionFilterProp="label"
                        onChange={(e) => {setParentId(e)}}
                        options={options}
                        disabled
                      />
                    </div>
                  )}
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
                    navigate("/admin/category");
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Spin>
  );
};

export default memo(EditCategory);
