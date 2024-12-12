import { memo, useEffect, useState } from "react";
import { StyledInput, StyledTabs } from "./style";
import "./UserOrder.scss";
import { Table, Tag, DatePicker } from "antd";
import { axiosApi } from "../../../../services/UserService";

const { TabPane } = StyledTabs;
const { RangePicker } = DatePicker;

function UserOrder() {
  const [orderList, setOrderList] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi
      .get(`/api/v1/user/order`)
      .then((res) => {
        setOrderList(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  });

  const columns = [
    {
      title: "Ảnh sản phẩm",
      dataIndex: "product_image",
      key: "product_image",
      render: (thumbnail_url) => (
        <img src={thumbnail_url} alt="" height={"100px"} width={"100px"} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Số lượng",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Thành tiền",
      key: "total_price",
      dataIndex: "total_price",
      render: (total_price) => (
        <>
          {total_price?.toLocaleString()}
          <sup>đ</sup>
        </>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
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
  ];

  let data = [];
  if (orderList.length) {
    orderList.forEach((order) => {
      order.products.forEach((product, index) => {
        data.push({
          product_image: product.thumbnail_url,
          product_name: product.name,
          order_id: order.orderId,
          quantity: product.quantity,
          total_price: parseInt(
            product.original_price *
              (1 - product.discount_rate / 100) *
              product.quantity
          ),
          status: order.status[index],
          orderDate: new Date(order.createdAt).toLocaleDateString("vi-VN"),
        });
      });
    });
  }

  const getFilteredData = (status) => {
    return data.filter((order) => {
      // Kiểm tra trạng thái đơn hàng
      const matchesStatus = status ? order.status === status : true;

      const matchesSearch =
        searchValue === "" ||
        order.order_id?.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.order_id?.toLowerCase().includes(searchValue.toLowerCase());

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
  return (
    <div className="container">
      <div className="row mt-4 mb-2">
        <div className="col-12">
          <h3>Đơn hàng của tôi</h3>
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
              <Table
                columns={columns}
                dataSource={getFilteredData("pending")}
              />
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
              <Table
                columns={columns}
                dataSource={getFilteredData("packaging")}
              />
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
              <Table
                columns={columns}
                dataSource={getFilteredData("delivering")}
              />
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
              <Table
                columns={columns}
                dataSource={getFilteredData("delivered")}
              />
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
              <Table
                columns={columns}
                dataSource={getFilteredData("cancelled")}
              />
            </TabPane>
          </StyledTabs>
        </div>
      </div>
    </div>
  );
}

export default memo(UserOrder);
