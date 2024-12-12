import React, { memo, useEffect, useState } from "react";
import "./Home.scss";
import banner from "../../../assets/images/banner.png";
import {
  TruckFilled,
  ReloadOutlined,
  CustomerServiceFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Col } from "react-bootstrap";

import "react-multi-carousel/lib/styles.css";
import { axiosApi } from "../../../services/UserService";
import ProductItem from "../../../components/ProductItem";
import { CustomCarousel } from "./style";
import { animateScroll } from "react-scroll";

const Home = () => {
  // Lọc và sắp xếp sản phẩm bán chạy
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [productsDisplayed, setProductsDisplayed] = useState(15);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosApi
      .get("/api/v1/products")
      .then((res) => {
        const sortedProducts = res.data.data
          .filter(
            (product) =>
              product.quantity_sold && product.quantity_sold.value > 0
          )
          .sort((a, b) => b.quantity_sold.value - a.quantity_sold.value)
          .slice(0, 10);
        setBestSellingProducts(sortedProducts);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu sản phẩm:", error);
        window.location.reload();
      });
  }, []);

  useEffect(() => {
    axiosApi
      .get("/api/v1/products")
      .then((res) => {
        const sortedProducts = res.data.data
          .filter(
            (product) =>
              product.rating_average !== null &&
              product.rating_average !== undefined
          )
          .sort((a, b) => b.rating_average - a.rating_average);

        setRecommendedProducts(sortedProducts);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu sản phẩm:", error);
        window.location.reload();
      });
  }, []);

  useEffect(() => {
    axiosApi
      .get("/api/v1/category")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const loadMoreRecommendedProducts = () => {
    animateScroll.scrollToBottom({
      duration: 800,
      smooth: true,
    });
    setProductsDisplayed((prev) => prev + 20);
  };

  return (
    <div className="container">
      <div className="row my-3">
        <div className="col-12">
          <div className="inner-categories">
            {categories?.map((item) => (
              <div className="inner-categories-item" key={item.id}>
                <div className="inner-image">
                  <img src={item.icon_url} alt="" />
                </div>
                <div className="inner-text">
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="row my-3">
        <div className="col-12">
          <div className="inner-banner">
            <img src={banner} alt="" />
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-12">
          <div className="inner-product-1">
            <h2>Sản phẩm bán chạy</h2>
            <section className="best-selling-products">
              <CustomCarousel>
                {bestSellingProducts.length > 0
                  ? bestSellingProducts.map((product) => (
                      <ProductItem product={product} key={product.id} />
                    ))
                  : [...Array(5)].map((_, index) => (
                      <ProductItem product={null} key={index} loading={true} />
                    ))}
              </CustomCarousel>
            </section>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-12">
          <div className="inner-commit">
            <div className="ghnc">
              <TruckFilled />
              <span>Giao hàng nhanh chóng</span>
            </div>
            <div>
              <CustomerServiceFilled />
              <span>Hỗ trợ trực tuyến</span>
            </div>
            <div>
              <ReloadOutlined />
              <span>Hoàn tiền nhanh chóng</span>
            </div>
            <div>
              <StarOutlined />
              <span>Sản phẩm chất lượng cao</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-12">
          <div className="inner-product-2">
            <h2>Sản phẩm đề xuất</h2>
            <div className="product-grid-container">
              {recommendedProducts.length > 0
                ? recommendedProducts
                    .slice(0, productsDisplayed)
                    .map((product) => (
                      <Col
                        key={product.id}
                        className="d-flex justify-content-center"
                      >
                        <ProductItem product={product} />
                      </Col>
                    ))
                : [...Array(40)].map((_, index) => (
                    <Col key={index} className="d-flex justify-content-center">
                      <ProductItem product={null} loading={true} />
                    </Col>
                  ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-12">
          <div className="inner-more">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadMoreRecommendedProducts}
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default memo(Home);
