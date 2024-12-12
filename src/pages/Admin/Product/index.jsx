import { memo, useEffect, useRef, useState } from "react";
import { axiosApi } from "../../../services/UserService";
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown, Table } from "antd";
import "./Product.scss";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDeleted, setHasDeleted] = useState(false);
  const dropdownCategoryId = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosApi
      .get("/api/v1/admin/product", {
        params: { categoryId: dropdownCategoryId.current },
      })
      .then((data) => {
        setProducts(data.data.products);
        setLoading(false);
      });
  }, [hasDeleted]);

  useEffect(() => {
    axiosApi.get("/api/v1/admin/category").then((data) => {
      setCategories(data.data.data);
    });
  }, [hasDeleted]);

  const handleMoveToEdit = (product) => {
    navigate("/admin/product/edit", { state: { product: product } });
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
          .patch("/api/v1/admin/product/delete", {
            id: product.id,
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
      key: "id",
      dataIndex: "id",
      render: (e) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>{e}</div>
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
      title: "Tên sản phẩm",
      key: "name",
      dataIndex: "name",
      render: (e) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>{e}</div>
      ),
    },
    {
      title: "Đơn giá",
      key: "price",
      dataIndex: "price",
      render: (price) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>
          {price.toLocaleString()}
          <sup>đ</sup>
        </div>
      ),
    },
    {
      title: "Phần trăm giảm giá",
      key: "discountRate",
      dataIndex: "discountRate",
      render: (discountRate) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>
          {discountRate.toLocaleString()}%
        </div>
      ),
    },
    {
      title: "Số lượng tồn kho",
      key: "stockQuantity",
      dataIndex: "stockQuantity",
      render: (e) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>{e}</div>
      ),
    },
    {
      title: "Số lượng đã bán",
      key: "quantitySold",
      dataIndex: "quantitySold",
      render: (e) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>{e}</div>
      ),
    },
    {
      title: "Danh mục gốc",
      key: "rootCategory",
      dataIndex: "rootCategory",
      render: (e) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>{e}</div>
      ),
    },
    {
      title: "Danh mục sản phẩm",
      key: "category",
      dataIndex: "category",
      render: (e) => (
        <div style={{ fontFamily: '"Lexend", sans-serif' }}>{e}</div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="delete-btn"
            onClick={() => handleMoveToEdit(record)}
          >
            <EditOutlined />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  const data = products.map((product) => {
    const rootCategory = categories.find(
      (category) =>
        category.id === parseInt(product.primary_category_path.split("/")[2])
    )?.text;
    return {
      id: product.id,
      thumbnail: product.thumbnail_url,
      name: product.name,
      price: product.price,
      discountRate: product.discount_rate,
      stockQuantity: product.stock_item?.qty || 0,
      rootCategory: rootCategory,
      category: categories
        .find(
          (category) =>
            category.id ===
            parseInt(product.primary_category_path.split("/")[2])
        )
        ?.children.find(
          (category) =>
            category.id ===
            parseInt(product.primary_category_path.split("/")[3])
        )?.name,
      rootCategoryId: categories.find(
        (category) =>
          category.id === parseInt(product.primary_category_path.split("/")[2])
      )?.id,
      categoryId: categories
        .find(
          (category) =>
            category.id ===
            parseInt(product.primary_category_path.split("/")[2])
        )
        ?.children.find(
          (category) =>
            category.id ===
            parseInt(product.primary_category_path.split("/")[3])
        )?.id,
      quantitySold: product.quantity_sold?.value || 0,
      description: product.description,
    };
  });

  const handleClickDropdown = (e) => {
    const categoryId = e.target.getAttribute("category_id");
    dropdownCategoryId.current = categoryId;
    setLoading(true);
    axiosApi("/api/v1/admin/product", {
      params: { categoryId: categoryId },
    }).then((res) => {
      setProducts(res.data.products);
      setLoading(false);
    });
  };

  const dropdownItems = categories?.map((category) => ({
    label: (
      <div onClick={handleClickDropdown} category_id={category.id}>
        {category.text}
      </div>
    ),
    key: `${category.id}`,
  }));

  return (
    <div className="container-fluid">
      <div className="row my-3">
        <h2 className="page-title">Quản lý sản phẩm</h2>
      </div>

      <div className="row my-3 mx-4 justify-content-between">
        <div className="col-6">
          <Dropdown menu={{ items: dropdownItems, selectable: true }}>
            <button type="button" className="dropdown-button">
              <span>Danh mục gốc</span>
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
        <div className="col-6">
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => {
              navigate("/admin/product/add");
            }}
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-12">
          <Table loading={loading} dataSource={data} columns={columns} />
        </div>
      </div>
    </div>
  );
}

export default memo(Product);
