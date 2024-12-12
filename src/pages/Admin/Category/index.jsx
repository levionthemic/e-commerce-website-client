import { memo, useEffect } from "react";
import React, { useState } from "react";
import { Space, Switch, Table } from "antd";
import { axiosApi } from "../../../services/UserService";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

function Category() {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosApi.get("/api/v1/admin/category").then((res) => {
      setCategories(res.data.data);
      setSellers(res.data.sellers);
      setLoading(false);
    });
  }, []);

  const handleMoveToEdit = (category) => {
    navigate("/admin/category/edit", { state: { category: category}});
  };

  const columns = [
    {
      title: "ID danh mục",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Ảnh minh họa",
      dataIndex: "icon",
      key: "icon",
      width: "10%",
      render: (url) => (
        <>{url ? <img src={url} alt="" width={60} height={60} /> : <></>}</>
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "ID người bán",
      dataIndex: "seller_id",
      key: "seller_id",
    },
    {
      title: "Tên người bán",
      dataIndex: "sellerName",
      key: "sellerName",
      width: "20%",
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="delete-btn" onClick={() => handleMoveToEdit(record)}>
            <EditOutlined />
          </button>
          {/* <button className="delete-btn" onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </button> */}
        </div>
      ),
    },
  ];

  const getListChildCategories = (categories, parentId) => {
    return categories.map((category) => {
      if (category.children) {
        return {
          key: category.id,
          id: category.id,
          name: category.name || category.text,
          children: getListChildCategories(category.children, category.id),
          isParentCategory: false,
          parentId: parentId
        };
      }
      return {
        key: category.id,
        id: category.id,
        name: category.name || category.text,
        isParentCategory: false,
        parentId: parentId
      };
    });
  };

  const data = categories.map((category, index) => ({
    key: category.id,
    id: category.id,
    icon: category.icon_url,
    name: category.text || category.name,
    seller_id: category.seller_id,
    sellerName: sellers[index]?.fullname,
    children: getListChildCategories(category.children, category.id),
    isParentCategory: true
  }));

  return (
    <div className="container-fluid">
      <div className="row my-3">
        <h2 className="page-title">Quản lý danh mục</h2>
      </div>
      <div className="row my-3">
        <div className="col-12">
          <Space
            align="center"
            style={{
              marginBottom: 16,
            }}
          >
            CheckStrictly:{" "}
            <Switch checked={checkStrictly} onChange={setCheckStrictly} />
          </Space>
          <Table
            columns={columns}
            rowSelection={{
              ...rowSelection,
              checkStrictly,
            }}
            dataSource={data}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Category);
