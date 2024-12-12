import React, { useState, useEffect, memo } from "react";
import "./AddProduct.scss";
import { useNavigate } from "react-router-dom";
import { Spin, Tooltip, Upload, message } from "antd";
import { axiosApi } from "../../../../services/UserService";
import Swal from "sweetalert2";

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [discountRate, setDiscountRate] = useState();
  const [description, setDescription] = useState();
  const [stockQty, setStockQty] = useState();
  const [categories, setCategories] = useState();
  const [category, setCategory] = useState();
  const [rootCategory, setRootCategory] = useState();

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState();

  const [isUploadImage, setIsUploadImage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosApi("/api/v1/admin/category").then((res) => {
      setCategories(res.data.data);
      setLoading(false);
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
      text: "Xác nhận cập nhật sản phẩm?",
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
          .post("/api/v1/admin/product/add", {
            name: name,
            price: price,
            discountRate: discountRate,
            description: description,
            stockQty: stockQty,
            thumbnailUrl: imgUrl,
            rootCategoryId: rootCategory?.split("&")[0],
            rootCategoryName: rootCategory?.split("&")[1],
            categoryId: category.split("&")[0],
            categoryName: category.split("&")[1],
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
    <Spin spinning={loading} tip="Đang tải...">
      <div className="add-product-admin">
        <h3>Tạo sản phẩm</h3>
        <form action="" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12">
              <div className="form-group mb-4">
                <label>Tên sản phẩm:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="description">Mô tả sản phẩm</label>
                <textarea
                  className="form-control"
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                >
                  {description}
                </textarea>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="form-group mb-4">
                    <label>Số lượng sản phẩm</label>
                    <input
                      type="number"
                      className="form-control"
                      value={stockQty}
                      onChange={(e) => setStockQty(parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group mb-3">
                    <label htmlFor="price">Giá (VND):</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      value={price}
                      onChange={(e) => {
                        setPrice(parseInt(e.target.value));
                      }}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group mb-3">
                    <label htmlFor="discount">Giảm giá (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="discount"
                      value={discountRate || 0}
                      onChange={(e) =>
                        setDiscountRate(parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="thumbnail_url">Ảnh sản phẩm</label>
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
                            className="product-image"
                          />
                        ) : (
                          <p className="click-upload">Upload tại đây</p>
                        )}
                      </Upload>
                    </Tooltip>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group mb-3">
                    <label htmlFor="rootCategory">Danh mục gốc</label>
                    <select
                      name="rootCategory"
                      id="rootCategory"
                      onChange={(e) => setRootCategory(e.target.value)}
                    >
                      <option disabled selected>
                        -- Chọn danh mục --
                      </option>
                      {categories?.map((category) => (
                        <option value={`${category.id}&${category.text}`}>
                          {category.text}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Danh mục sản phẩm</label>
                    <select
                      name="category"
                      id="category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option disabled selected>
                        -- Chọn danh mục --
                      </option>
                      {categories
                        ?.find(
                          (category) =>
                            category.id ===
                            parseInt(rootCategory?.split("&")[0])
                        )
                        ?.children.map((category) => (
                          <option value={`${category.id}&${category.name}`}>
                            {category.name}
                          </option>
                        ))}
                    </select>
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
                    navigate(-1);
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

export default memo(AddProduct);
