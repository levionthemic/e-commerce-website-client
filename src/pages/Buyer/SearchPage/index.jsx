/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import "./SearchPage.css";
import { axiosApi } from "../../../services/UserService";
import ProductItem from "../../../components/ProductItem";
import { useNavigate } from "react-router-dom";
import { animateScroll } from "react-scroll";
import Sider from "./Sider";
import { Spin } from "antd";

const SearchPage = () => {
  const [sortOption, setSortOption] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const url = new URL(window.location.href);
  const keyword = url.searchParams.get("keyword").toLowerCase() || "";
  const page = parseInt(url.searchParams.get("page")) || 1;

  const navigate = useNavigate();

  window.onload = () => {
    animateScroll.scrollToTop({
      duration: 800,
      smooth: true,
      offset: -70,
    });
  };

  const defineSort = (sortOption) => {
    let sortKey = "",
      sortValue = "";
    switch (sortOption) {
      case 1:
        sortKey = "slug";
        sortValue = "asc";
        break;
      case 2:
        sortKey = "slug";
        sortValue = "desc";
        break;
      case 3:
        sortKey = "original_price";
        sortValue = "asc";
        break;
      case 4:
        sortKey = "original_price";
        sortValue = "desc";
        break;
      case 5:
        sortKey = "quantity_sold.value";
        sortValue = "desc";
        break;
      case 6:
        sortKey = "quantity_sold.value";
        sortValue = "asc";
        break;
      case 7:
        sortKey = "rating_average";
        sortValue = "desc";
        break;
      case 8:
        sortKey = "rating_average";
        sortValue = "asc";
        break;

      default:
        break;
    }
    return { sortKey, sortValue };
  };

  const updateCategoryId = (categoryId) => {
    setCategoryId(categoryId);
  };

  useEffect(() => {
    navigate(`/search?keyword=${keyword}&page=1`);
    animateScroll.scrollToTop({
      duration: 800,
      smooth: true,
      offset: -70,
    });
  }, [categoryId]);

  useEffect(() => {
    const { sortKey, sortValue } = defineSort(sortOption);
    try {
      setLoadingProduct(true);
      axiosApi("/api/v1/products/search", {
        params: {
          keyword: keyword,
          page: page,
          sortKey: sortKey,
          sortValue: sortValue,
          categoryId: categoryId,
        },
      }).then((data) => {
        setProducts(data.data.data);
        setTotalPages(data.data.totalPages || 1);
        setLoadingProduct(false);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [page, sortOption, categoryId]);

  useEffect(() => {
    try {
      setLoading(true);
      axiosApi("/api/v1/products/search", {
        params: {
          keyword: keyword,
          page: 1,
        },
      }).then((data) => {
        setCategoryId(null);
        setSortOption(0);
        setProducts(data.data.data);
        setParentCategories(data.data.listParentCategories);
        setTotalPages(data.data.totalPages || 1);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [keyword]);

  return (
    <>
      <div className="search-page container">
        <Row>
          <Col md={3}>
            <div className="filters-section">
              <Spin spinning={loading} tip="Đang tải...">
                <Sider
                  parentCategories={parentCategories}
                  onUpdateCategoryId={updateCategoryId}
                />
              </Spin>
            </div>
          </Col>

          <Col md={9}>
            <h5>Kết quả tìm kiếm cho "{keyword}"</h5>

            <div className="row">
              <div className="col-12">
                <div className="inner-service">
                  <div className="inner-page">
                    <span>Trang {page}</span>
                  </div>
                  <div className="inner-action">
                    <div className="inner-sort">
                      <span>Sắp xếp: </span>
                      <select
                        className="form-select"
                        id="sort"
                        defaultValue={sortOption}
                        onChange={(e) => {
                          setSortOption(parseInt(e.target.value));
                        }}
                      >
                        <option value={0}>Mặc định</option>
                        <option value={1}>Từ A - Z</option>
                        <option value={2}>Từ Z - A</option>
                        <option value={3}>Giá tăng dần</option>
                        <option value={4}>Giá giảm dần</option>
                        <option value={5}>Lượt bán giảm dần</option>
                        <option value={6}>Lượt bán tăng dần</option>
                        <option value={7}>Số sao giảm dần</option>
                        <option value={8}>Số sao tăng dần</option>
                      </select>
                    </div>
                  </div>
                  <Pagination className="justify-content-end">
                    <Pagination.Prev
                      onClick={() => {
                        animateScroll.scrollToTop({
                          duration: 800,
                          smooth: true,
                          offset: -70,
                        });
                        setTimeout(() => {
                          url.searchParams.set("page", Math.max(page - 1, 1));
                          navigate(url.pathname + url.search);
                        }, 800);
                      }}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index}
                        active={index + 1 === page}
                        onClick={() => {
                          animateScroll.scrollToTop({
                            duration: 800,
                            smooth: true,
                            offset: -70,
                          });
                          setTimeout(() => {
                            url.searchParams.set("page", index + 1);
                            navigate(url.pathname + url.search);
                          }, 800);
                        }}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => {
                        animateScroll.scrollToTop({
                          duration: 800,
                          smooth: true,
                          offset: -70,
                        });
                        setTimeout(() => {
                          url.searchParams.set(
                            "page",
                            Math.min(page + 1, totalPages)
                          );
                          navigate(url.pathname + url.search);
                        }, 800);
                      }}
                    />
                  </Pagination>
                </div>
              </div>
            </div>

            <Row xs={1} md={4} className="g-3">
              {loadingProduct ? (
                <>
                  {Array.from({ length: 40 }).map((_, index) => (
                    <Col
                      key={index}
                      style={{
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ProductItem product={null} loading={true} />
                    </Col>
                  ))}
                </>
              ) : (
                <>
                  {!products.length ? (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "80px",
                        color: "#555",
                        width: "100%",
                      }}
                    >
                      <h2>Không tìm thấy sản phẩm</h2>
                      <p>Hãy thử tìm kiếm với từ khóa khác.</p>
                    </div>
                  ) : (
                    <>
                      {products.map((product) => (
                        <Col
                          key={product._id}
                          style={{
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ProductItem product={product} loading={false} />
                        </Col>
                      ))}
                    </>
                  )}
                </>
              )}
            </Row>

            {/* Phân trang */}
            <Pagination className="mt-4 mb-3 justify-content-center">
              <Pagination.Prev
                onClick={() => {
                  animateScroll.scrollToTop({
                    duration: 800,
                    smooth: true,
                    offset: -70,
                  });
                  setTimeout(() => {
                    url.searchParams.set("page", Math.max(page - 1, 1));
                    navigate(url.pathname + url.search);
                  }, 800);
                }}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === page}
                  onClick={() => {
                    animateScroll.scrollToTop({
                      duration: 800,
                      smooth: true,
                      offset: -70,
                    });
                    setTimeout(() => {
                      url.searchParams.set("page", index + 1);
                      navigate(url.pathname + url.search);
                    }, 800);
                  }}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => {
                  animateScroll.scrollToTop({
                    duration: 800,
                    smooth: true,
                    offset: -70,
                  });
                  setTimeout(() => {
                    url.searchParams.set(
                      "page",
                      Math.min(page + 1, totalPages)
                    );
                    navigate(url.pathname + url.search);
                  }, 800);
                }}
              />
            </Pagination>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SearchPage;
