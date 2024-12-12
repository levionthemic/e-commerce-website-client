import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { axiosApi } from "../../../services/UserService";
import { useNavigate } from "react-router-dom";
import { Table, Skeleton } from "antd";
import { DeleteOutlined, DiffOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { decreaseCartQuantity } from "../../../redux/slices/cartSlice";

const CartPage = () => {
  const [cartList, setCartList] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]); // Lưu trữ các dòng được chọn

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartQuantity = useSelector((state) => state.cart.quantity);

  const showUpdateButton = (e, temp, indexRow) => {
    const updateButton =
      e.target.parentElement.parentElement.nextSibling.nextSibling.querySelector(
        ".delete-btn-1:nth-child(2)"
      );
    if (temp[indexRow] !== cartList[indexRow].quantity) {
      updateButton.classList.remove("d-none");
    } else {
      updateButton.classList.add("d-none");
    }
  };
  const handleIncreaseQuantity = (e) => {
    const indexRow =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-row-key"
      );
    let temp = [...quantities];
    temp[indexRow]++;
    showUpdateButton(e, temp, indexRow);
    setQuantities(temp);
  };

  const handleDecreaseQuantity = (e) => {
    const indexRow =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-row-key"
      );
    let temp = [...quantities];
    temp[indexRow] = Math.max(temp[indexRow] - 1, 1);
    showUpdateButton(e, temp, indexRow);
    setQuantities(temp);
  };

  const handleDelete = (e) => {
    const indexRow =
      e.currentTarget.parentElement.parentElement.parentElement.getAttribute(
        "data-row-key"
      );
    Swal.fire({
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      title: "Cảnh báo!",
      text: "Bạn có chắc chắn muốn xóa?",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        axiosApi
          .post("/api/v1/cart/delete", {
            cartId: localStorage.getItem("cartId"),
            productId: cartList[indexRow].id,
          })
          .then(() => {
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
              title: "Xóa sản phẩm khỏi giỏ hàng thành công!",
            });
            dispatch(decreaseCartQuantity(1));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const handleUpdateQuantity = (e) => {
    const indexRow =
      e.currentTarget.parentElement.parentElement.parentElement.getAttribute(
        "data-row-key"
      );
    const cartId = localStorage.getItem("cartId");
    const productId = cartList[indexRow].id;
    const quantity = parseInt(
      e.currentTarget.parentElement.parentElement.previousSibling
        .previousSibling.firstChild.firstChild.nextSibling.innerText
    );
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
          .patch("/api/v1/cart/update", {
            cartId: cartId,
            productId: productId,
            quantity: quantity,
          })
          .then(() => {
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
              title: "Cập nhật số lượng thành công!",
            });
            const updateButton = document.querySelector(
              ".delete-btn-1:last-child"
            );
            updateButton.classList.add("d-none");
            cartList[indexRow].quantity = quantity;
            setCartList(cartList);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const totalPrice = selectedRows.reduce((sum, rowIndex) => {
    const item = cartList[rowIndex];
    return (
      sum +
      quantities[rowIndex] *
        item.original_price *
        (1 - item.discount_rate / 100)
    );
  }, 0);

  const handleSelectRow = (rowIndex, isSelected) => {
    if (isSelected) {
      setSelectedRows((prev) => [...prev, rowIndex]); // Thêm sản phẩm vào danh sách được chọn
    } else {
      setSelectedRows((prev) => prev.filter((index) => index !== rowIndex)); // Bỏ sản phẩm khỏi danh sách được chọn
    }
  };

  useEffect(() => {
    setLoading(true);
    axiosApi
      .get("/api/v1/cart/" + localStorage.getItem("cartId"))
      .then((res) => {
        setCartList(res.data.data);
        setQuantities(res.data.data.map((item) => item.quantity));
        setLoading(false);
      })
      .catch((error) => {
        setCartList([]);
        console.log(error.response);
        setLoading(false);
      });
  }, [cartQuantity]);

  const columns = [
    {
      title: "",
      key: "selected",
      dataIndex: "selected",
      render: (_, record, index) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(index)} // Kiểm tra trạng thái tick
          onChange={(e) => handleSelectRow(index, e.target.checked)} // Gọi hàm khi tick hoặc bỏ tick
        />
      ),
    },

    {
      title: "Ảnh sản phẩm",
      key: "thumbnail",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img src={thumbnail} alt="" width={"100px"} height="100px" />
      ),
    },
    {
      title: "Thông tin sản phẩm",
      key: "info",
      dataIndex: "info",
      render: ([name, category, id]) => (
        <div>
          <h6
            className="inner-name"
            onClick={() => {
              navigate(`/detailproduct/${id}`);
            }}
          >
            {name}
          </h6>
          <p>
            Phân loại: <i>{category}</i>
          </p>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      key: "price",
      dataIndex: "price",
      render: (price) => (
        <>
          {price.toLocaleString()}
          <sup>đ</sup>
        </>
      ),
    },
    {
      title: "Số lượng",
      key: "quantity",
      dataIndex: "quantity",
      render: (quantity) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            width: "fit-content",
          }}
        >
          <button
            style={{
              border: "none",
              borderRight: "1px solid #ddd",
              background: "none",
              textAlign: "center",
              fontSize: "18px",
              padding: "0px 7px",
            }}
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <div>{quantity}</div>
          <button
            style={{
              border: "none",
              borderLeft: "1px solid #ddd",
              background: "none",
              textAlign: "center",
              fontSize: "18px",
              padding: "0px 5px",
            }}
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
      ),
    },
    {
      title: "Thành tiền",
      key: "total_price",
      dataIndex: "total_price",
      render: (total_price) => (
        <div
          style={{
            fontSize: "18px",
            color: "red",
            fontWeight: 500,
            width: "110px",
          }}
        >
          {total_price.toLocaleString()}
          <sup>đ</sup>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      dataIndex: "actions",
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="delete-btn-1" onClick={handleDelete}>
            <DeleteOutlined />
          </button>
          <button className="delete-btn-1 d-none" onClick={handleUpdateQuantity}>
            <DiffOutlined />
          </button>
        </div>
      ),
    },
  ];

  const data = cartList.map((item, index) => ({
    key: index,
    selected: false,
    thumbnail: item.thumbnail_url,
    info: [item.name, item.categories.name, item.id],
    price: (
      item.original_price *
      (1 - item.discount_rate / 100)
    ).toLocaleString(),
    quantity: quantities[index],
    total_price:
      quantities[index] * item.original_price * (1 - item.discount_rate / 100),
  }));

  return (
    <div className="container my-5 cart-page">
      <h3 className="mb-4">Giỏ Hàng Của Bạn</h3>
      {loading ? (
        <>
          <div className="position-relative">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </>
      ) : (
        <>
          {cartList.length === 0 ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            <div className="position-relative">
              <Table dataSource={data} columns={columns} />

              <div className="summary-section text-end">
                <h5>
                  Tổng cộng: {totalPrice.toLocaleString()}
                  <sup>đ</sup>
                </h5>
                <button
                  className="btn btn-success mt-3"
                  onClick={() => {
                    const selectedItems = cartList.filter((_, index) =>
                      selectedRows.includes(index)
                    );
                    if (selectedItems.length === 0) {
                      Swal.fire({
                        icon: "warning",
                        title: "Chưa chọn sản phẩm!",
                        text: "Vui lòng chọn ít nhất một sản phẩm để tiếp tục.",
                      });
                      return;
                    }
                    navigate("/checkout", {
                      state: { cartList: selectedItems },
                    });
                  }}
                >
                  Mua Hàng
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
