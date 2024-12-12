import { memo } from "react";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Rating from "react-rating";
import "./ProductItem.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductItem({ product, loading }) {
  const navigate = useNavigate();
  return (
    <>
      {loading ? (
        <Card
          className="product-card"
          onClick={() => {
            navigate(`/detailproduct/${product.id}`);
          }}
        >
          <Skeleton height={160} />
          <Card.Body>
            <Card.Title>
              <Skeleton className="card-title" />
            </Card.Title>
            <Card.Text>
              <Skeleton className="product-price" />
            </Card.Text>
            <Card.Text>
              <Skeleton className="product-info" />
            </Card.Text>
            <Skeleton className="w-100 .btn" />
          </Card.Body>
        </Card>
      ) : (
        <Card
          className="product-card"
          onClick={() => {
            navigate(`/detailproduct/${product.id}`);
          }}
        >
          <Card.Img
            variant="top"
            src={product.thumbnail_url || "/images/default/default-product.png"}
          />
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>
              <span className="product-price">
                {(
                  product.price *
                  (1 - product.discount_rate / 100)
                ).toLocaleString()}
                <sup>đ</sup>
              </span>
            </Card.Text>
              <div className="product-info mb-3">
                <span>
                  {product.rating_average || "0"}{" "}
                  <Rating
                    emptySymbol="fa-regular fa-star"
                    fullSymbol="fa-solid fa-star"
                    initialRating={product.rating_average}
                    readonly
                    style={{ color: "#FBCA04" }}
                  />
                </span>{" "}
                | Đã bán: {product.quantity_sold?.value || 0}
              </div>
            <Link to={`/detailproduct/${product.id}`}>
              <Button variant="primary" className="w-100">
                Xem Chi Tiết
              </Button>
            </Link>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default memo(ProductItem);
