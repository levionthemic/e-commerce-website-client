import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import "./CartItem.css";

const CartItem = ({ item, onToggleSelect }) => {
  const dispatch = useDispatch();
  const defaultImage = "/images/default/default-product.png"; // Hình ảnh mặc định
  const [isSelected, setIsSelected] = useState(false);

  const handleToggleSelect = () => {
    setIsSelected(!isSelected);
    onToggleSelect(item.id, !isSelected);
  };

  return (
    <div className="cart-item row align-items-center border-bottom">
      <div className="col-md-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
        />
      </div>
      <div className="col-md-2">
        <img
          src={item.image || defaultImage}
          alt={item.name}
          className="img-fluid"
        />
      </div>
      <div className="col-md-3">
        <h5 className="product-name">{item.name}</h5>
        <p className="text-muted">
          Phân loại: {item.category || "Chưa xác định"}
        </p>
      </div>
      <div className="col-md-2 text-center">
        <span>
          {item.original_price *
            (1 - item.discount_rate / 100).toLocaleString()}
          <sup>đ</sup>
        </span>
      </div>
      <div className="col-md-2 d-flex align-items-center justify-content-center">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => dispatch(decreaseQuantity(item.id))}
        >
          -
        </button>
        <span className="mx-2">{item.quantity}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => dispatch(increaseQuantity(item.id))}
        >
          +
        </button>
      </div>
      <div className="col-md-1 text-center">
        <span>{(item.price * item.quantity).toLocaleString()} VNĐ</span>
      </div>
      <div className="col-md-1 text-center">
        <button
          className="btn btn-delete btn-sm"
          onClick={() => dispatch(removeFromCart(item.id))}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;
