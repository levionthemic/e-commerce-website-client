import React, { useState, useEffect } from "react";
import "./EditProduct.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip, Upload, message } from "antd";
import { axiosApi } from "../../../../services/UserService";
import Swal from "sweetalert2";

const EditProduct = () => {
  const product = useLocation().state?.product;
  const navigate = useNavigate();

  const [name, setName] = useState(product?.name);
  const [price, setPrice] = useState(product?.price);
  const [discountRate, setDiscountRate] = useState(product?.discountRate);
  const [description, setDescription] = useState(product?.description);
  const [stockQty, setStockQty] = useState(product?.quantity || 0);
  const [categories, setCategories] = useState();

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState();

  const [isUploadImage, setIsUploadImage] = useState(false);

  useEffect(() => {
    axiosApi("/api/v1/seller/product")
      .then(res => {
        setCategories(res.data.categories);
      })
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
    let imgUrl = "";
    if (isUploadImage) {
      imgUrl = await uploadImage();
    }

    axiosApi
      .patch("/api/v1/seller/product/edit", {
        id: product.productId,
        name: name,
        price: price,
        discountRate: discountRate,
        description: description,
        stockQty: stockQty,
        thumbnailUrl: imgUrl || product?.thumbnail_url,
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
  };

  return (
    <div className="edit-product">
      <h3>Chỉnh sửa sản phẩm</h3>
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
                    onChange={(e) => setDiscountRate(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
              <div className="form-group">
              <label htmlFor="thumbnail_url">Ảnh sản phẩm</label>
              <Tooltip title="Click để upload ảnh" placement="rightTop">
                <Upload
                  showUploadList={false}
                  customRequest={({ file }) => handleUpload(file)}
                  beforeUpload={beforeUpload}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="product-image" />
                  ) : (
                    <img
                      src={product?.thumbnail}
                      alt=""
                      className="product-image"
                    />
                  )}
                </Upload>
              </Tooltip>
            </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="category">Danh mục sản phẩm</label>
                  <select name="category" id="category" disabled>
                    <option disabled selected>-- Chọn danh mục --</option>
                    {categories?.map(category => (
                      <option value={category.id} selected={parseInt(product.categoryId) === category.id}>{category.name}</option>
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
  );
};

export default EditProduct;
