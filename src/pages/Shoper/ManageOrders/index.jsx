import React, { memo, useEffect, useState } from "react";
import { Table, Tag, DatePicker, Space } from "antd";
import "./ManageOrders.scss";
import {
  StyledTabs,
  StyledInput,
  StyledCheckSquare,
  StyledCloseSquare,
} from "./Style";
import { axiosApi } from "../../../services/UserService";
import Swal from "sweetalert2";

const { TabPane } = StyledTabs;
const { RangePicker } = DatePicker;

const ManageOrders = () => {
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [orders, setOrders] = useState([]);
  const [hasUpdated, setHasUpdated] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosApi.get("/api/v1/seller/order").then((res) => {
      setOrders(res.data.orders);
      setLoading(false);
    });
  }, [hasUpdated]);

  const handleConfirmOrder = (record) => {
    Swal.fire({
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      title: "Cảnh báo!",
      text: "Bạn có chắc chắn muốn đổi trạng thái đơn hàng?",
      confirmButtonText: "Chắc chắn",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        setLoading(true);
        axiosApi
          .patch("/api/v1/seller/order/changeStatus", {
            productId: record.productId,
            orderId: record.orderId,
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
              title: "Đã đổi trạng thái đơn hàng!",
            });
            setHasUpdated(!hasUpdated);
            setLoading(false);
          })
          .catch((error) => {
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
              title: "Đã có lỗi!",
            });
            setLoading(false);
          });
      }
    });
  };

  const handleRejectOrder = (record) => {
    Swal.fire({
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      title: "Cảnh báo!",
      text: "Bạn có chắc chắn muốn hủy đơn hàng?",
      confirmButtonText: "Chắc chắn",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        setLoading(true);
        axiosApi
          .patch("/api/v1/seller/order/cancel", {
            productId: record.productId,
            orderId: record.orderId,
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
              title: "Đã hủy đơn hàng!",
            });
            setHasUpdated(!hasUpdated);
            setLoading(false);
          })
          .catch((error) => {
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
              title: "Đã có lỗi!",
            });
            setLoading(false);
          });
      }
    });
  };

  const getFilteredData = (status) => {
    return orders.filter((order) => {
      // Kiểm tra trạng thái đơn hàng
      const matchesStatus = status ? order.status === status : true;

      // Kiểm tra giá trị tìm kiếm (tìm theo tên sản phẩm hoặc mã đơn hàng)
      const matchesSearch =
        searchValue === "" ||
        order.orderId.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchValue.toLowerCase());

      // Kiểm tra ngày đặt hàng
      const matchesDate =
        !dateRange ||
        (dateRange[0] &&
          dateRange[1] &&
          (() => {
            const [startDay, startMonth, startYear] = dateRange[0]
              .format("DD-MM-YYYY")
              .split("-");
            const [endDay, endMonth, endYear] = dateRange[1]
              .format("DD-MM-YYYY")
              .split("-");
            const [orderDay, orderMonth, orderYear] =
              order.orderDate.split("/");

            const startDate = new Date(startYear, startMonth - 1, startDay);
            const endDate = new Date(endYear, endMonth - 1, endDay);
            const orderDate = new Date(orderYear, orderMonth - 1, orderDay);

            return orderDate >= startDate && orderDate <= endDate;
          })());

      return matchesStatus && matchesSearch && matchesDate;
    });
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: 200,
    },
    {
      title: "Người đặt",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (total_price) => (
        <>
          {total_price.toLocaleString()}
          <sup>đ</sup>
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "pending") return <Tag color={"red"}>Chờ xác nhận</Tag>;
        if (status === "packaging")
          return <Tag color={"orange"}>Đang đóng gói</Tag>;
        if (status === "delivering")
          return <Tag color={"blue"}>Đang vận chuyển</Tag>;
        if (status === "delivered") return <Tag color={"green"}>Đã giao</Tag>;
        return <Tag color={"gray"}>Đã hủy</Tag>;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) =>
        record.status !== "cancelled" && record.status !== "delivered" ? (
          <Space className="action">
            <StyledCheckSquare
              onClick={() => handleConfirmOrder(record)}
            ></StyledCheckSquare>
            {record.status === "delivering" ? (
              <></>
            ) : (
              <div classname="deny">
                <StyledCloseSquare
                  onClick={() => handleRejectOrder(record)}
                ></StyledCloseSquare>
              </div>
            )}
          </Space>
        ) : null,
    },
  ];

  return (
    <div className="inner-wrap-order-management">
      <h2 className="mb-3">Quản lý đơn hàng</h2>
      <StyledTabs defaultActiveKey="1">
        <TabPane tab="Tất cả" key="1">
          <div
            classname="inner-search"
            style={{ marginBottom: 16, display: "flex", gap: "10px" }}
          >
            <StyledInput
              placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={getFilteredData()}
          />
        </TabPane>
        <TabPane tab="Chờ xác nhận" key="2">
          <div
            classname="inner-search"
            style={{ marginBottom: 16, display: "flex", gap: "10px" }}
          >
            <StyledInput
              placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <Table columns={columns} dataSource={getFilteredData("pending")} />
        </TabPane>
        <TabPane tab="Đang đóng gói" key="3">
          <div
            classname="inner-search"
            style={{ marginBottom: 16, display: "flex", gap: "10px" }}
          >
            <StyledInput
              placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <Table columns={columns} dataSource={getFilteredData("packaging")} />
        </TabPane>
        <TabPane tab="Đang vận chuyển" key="4">
          <div
            classname="inner-search"
            style={{ marginBottom: 16, display: "flex", gap: "10px" }}
          >
            <StyledInput
              placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <Table columns={columns} dataSource={getFilteredData("delivering")} />
        </TabPane>
        <TabPane tab="Đã giao" key="5">
          <div
            classname="inner-search"
            style={{ marginBottom: 16, display: "flex", gap: "10px" }}
          >
            <StyledInput
              placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <Table columns={columns} dataSource={getFilteredData("delivered")} />
        </TabPane>
        <TabPane tab="Đã hủy" key="6">
          <div
            classname="inner-search"
            style={{ marginBottom: 16, display: "flex", gap: "10px" }}
          >
            <StyledInput
              placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <Table columns={columns} dataSource={getFilteredData("cancelled")} />
        </TabPane>
      </StyledTabs>
    </div>
  );
};

export default memo(ManageOrders);
