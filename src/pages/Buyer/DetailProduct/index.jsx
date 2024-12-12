import React, { useState, useEffect, useRef } from "react";
import { PlusOutlined, MinusOutlined, EditFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom"; // Import useParams để lấy params từ URL
import "./DetailProduct.css";
import { axiosApi } from "../../../services/UserService";
import Rating from "react-rating";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { increaseCartQuantity } from "../../../redux/slices/cartSlice";
import { Spin } from "antd";

const DetailProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0); // Chỉ mục ảnh hiện tại
  const reviewSectionRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        axiosApi.get(`/api/v1/products/detail/${productId}`).then((res) => {
          if (res.data.code === 200) {
            setProduct(res.data.data);
          } else {
            console.error("Sản phẩm không tồn tại");
          }
        });
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  // Hàm thay đổi ảnh khi click vào thumbnail
  // const handleThumbnailClick = (index) => {
  //   setCurrentImageIndex(index);
  // };

  const handleScrollToReviews = () => {
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePurchaseNow = () => {};

  const handleAddToCart = () => {
    axiosApi
      .post("api/v1/cart/add", {
        cartId: localStorage.getItem("cartId"),
        productId: productId,
        quantity: quantity,
      })
      .then((res) => {
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
          icon: "success",
          title: "Thêm vào giỏ hàng thành công!",
        });
        if (res.data.hasQuantityUpdated)
          dispatch(increaseCartQuantity(1));
      })
      .catch(() => {
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
          icon: "error",
          title: "Không thể thêm sản phẩm vào giỏ hàng!",
        });
      });
  };

  return (
    <Spin spinning={loading} tip="Loading" size="large">
      <div className="container my-4">
        <div className="row">
          <div className="col-4">
            <div className="image-gallery">
              <img
                src={product?.thumbnail_url}
                alt={product?.name}
                className="img-fluid"
                style={{ maxHeight: "500px", objectFit: "contain" }}
              />
            </div>
            {/* <div className="thumbnail-gallery mt-2 d-flex justify-content-center">
            {product.images &&
              product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    currentImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                  style={{
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                    margin: "0 5px",
                    border:
                      currentImageIndex === index
                        ? "2px solid #007bff"
                        : "2px solid transparent",
                  }}
                />
              ))}
          </div> */}
          </div>

          <div className="col-8">
            <div className="product-infomation">
              <h1>{product?.name}</h1>
              <hr />
              <div className="inner-rating mb-3">
                <div className="rating">
                  <Rating
                    emptySymbol="fa-regular fa-star"
                    fullSymbol="fa-solid fa-star"
                    initialRating={product?.rating_average}
                    readonly
                    style={{ color: "#FBCA04" }}
                  />
                  <p>{product?.rating_average || 0}</p>
                </div>
                <div className="divider"></div>
                <div className="review-info">
                  <span style={{ marginRight: "-5px" }}>
                    {product?.reviews ? product?.reviews.length : 0}
                  </span>
                  <span
                    className="inner-review"
                    onClick={handleScrollToReviews}
                  >
                    <span>Đánh giá </span>
                    <EditFilled />
                  </span>
                </div>
              </div>

              <div className="store-name mb-2">
                Cửa hàng: {product?.storeName}
              </div>

              <div className="product-id mb-2">
                Mã sản phẩm: {product?.id}
              </div>

              <div className="quantity mb-2">
                Số lượng còn:{" "}
                {product?.stock_item ? product?.stock_item.qty : 0}
              </div>

              <div className="quantity-sold mb-2">
                Đã bán:{" "}
                {product?.quantity_sold ? product?.quantity_sold.value : "0"}
              </div>
              <hr />

              <div className="prices mt-2">
                <span className="new-price">
                  {(
                    product?.price *
                    (1 - product?.discount_rate / 100)
                  ).toLocaleString()}
                  <sup>đ</sup>
                </span>
                <span className="discount-rate">{`-${product?.discount_rate}%`}</span>
                <span className="old-price text-muted ml-2">
                  {product?.price.toLocaleString()}
                  <sup>đ</sup>
                </span>
              </div>

              <div className="quantity mt-3">
                <span className="font-weight-bold">Số lượng:</span>
                <div className="inner-quantity">
                  <MinusOutlined
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    className="minus"
                  />
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    min="1"
                    max={product?.stock_item.qty || 1000}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                    style={{
                      width: "60px",
                      textAlign: "center",
                      margin: "0 5px",
                    }}
                  />
                  <PlusOutlined
                    onClick={() =>
                      setQuantity(
                        quantity < (product?.stock_item.qty || 1000)
                          ? quantity + 1
                          : product?.stock_item.qty || 1000
                      )
                    }
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    className="plus"
                  />
                </div>
              </div>

              <div className="button-container mt-3">
                <button className="btn" onClick={handlePurchaseNow}>
                  Mua ngay
                </button>
                <button className="btn" onClick={handleAddToCart}>
                  Thêm vào giỏ hàng
                </button>
              </div>
              <hr />
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="description mt-2">
              <h2 className="description-title">MÔ TẢ SẢN PHẨM</h2>
              <div dangerouslySetInnerHTML={{ __html: product?.description }} />
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="reviews " ref={reviewSectionRef}>
              <h3>ĐÁNH GIÁ SẢN PHẨM CỦA KHÁCH HÀNG</h3>
              <div className="review-summary mt-4">
                <h4 style={{ color: "red" }}>
                  {product?.rating || 0}
                  <span className="red-stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className="star filled">
                        ★
                      </span>
                    ))}
                  </span>
                </h4>
                <p className="review-stats">
                  Số bình luận: {product?.reviews ? product?.reviews.length : 0}
                </p>
              </div>

              {product?.reviews &&
                product?.reviews.map((review) => (
                  <div key={review.id}>{/* Render review details */}</div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default DetailProduct;
