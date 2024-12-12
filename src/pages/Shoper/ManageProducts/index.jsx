import React, { useState, useEffect } from "react";
import { axiosApi } from "../../../services/UserService";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./ManageProducts.css";
import Swal from "sweetalert2";
import { Table } from "antd";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [hasDeleted, setHasDeleted] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get("/api/v1/seller/product");
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching all products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [hasDeleted]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `/api/v1/seller/product/search?keyword=${searchTerm}`
        );
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchProducts();
    }
  }, [searchTerm]);

  const handleEdit = (product) => {
    navigate("/shop/products/edit", { state: { product: product } });
  };

  const handleDelete = (product) => {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo",
      text: "Xác nhận xóa sản phẩm?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        axiosApi
          .patch("/api/v1/seller/product/delete", {
            _id: product.key,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: res.data.message,
            });
            setHasDeleted(!hasDeleted);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: error.response.data.message,
            });
          });
      }
    });
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (url) => <img src={url} alt="" width={80} height={80} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <>
          {price.toLocaleString()}
          <sup>đ</sup>
        </>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discountRate",
      key: "discountRate",
      render: (discountRate) => <>{discountRate}%</>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "quantitySold",
      key: "quantitySold",
    },
    {
      title: "Mã danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Thao tác",
      key: "actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px"}}>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleEdit(record)}
            style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "35px", height: "35px", fontSize: "20px"}}
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(record)}
            style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "35px", height: "35px", fontSize: "18px"}}
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  const data = products.map((product) => ({
    key: product._id,
    productId: product.id,
    thumbnail: product.thumbnail_url,
    name: product.name,
    price: product.price,
    discountRate: product.discount_rate,
    quantity: product.stock_item?.qty || 0,
    quantitySold: product.quantity_sold?.value || 0,
    category: product.categories?.name || "",
    categoryId: product.categories?.id || "",
  }));

  return (
    <div className="store-products mx-4 my-3">
      <h2 className="mb-3">Quản lý sản phẩm</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo Tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table loading={loading} columns={columns} dataSource={data} />
    </div>
  );
};

export default ManageProducts;
