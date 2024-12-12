import { memo, useEffect, useRef } from "react";
import "./User.scss";
import { useState } from "react";
import { Dropdown, Table } from "antd";
import { axiosApi } from "../../../services/UserService";
import { DeleteOutlined, DiffOutlined, DownOutlined } from "@ant-design/icons";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

function User() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const dropdownRole = useRef();

  useEffect(() => {
    setLoading(true);
    axiosApi
      .get("/api/v1/admin/user", { params: { role: dropdownRole.current } })
      .then((res) => {
        setUsers(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleMoveToEdit = (user) => {
    navigate("/admin/user/edit", { state: { user: user } });
  };

  const columns = [
    {
      title: "Ảnh đại diện",
      key: "avatar",
      dataIndex: "avatar",
      render: (avatar) => (
        <img src={avatar} alt="" width={"80px"} height="80px" />
      ),
    },
    {
      title: "Họ và tên",
      key: "fullname",
      dataIndex: "fullname",
    },
    {
      title: "Ngày sinh",
      key: "birthday",
      dataIndex: "birthday",
    },
    {
      title: "Tên biệt danh",
      key: "nickname",
      dataIndex: "nickname",
    },
    {
      title: "Giới tính",
      key: "sex",
      dataIndex: "sex",
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      key: "phoneNumber",
      dataIndex: "phoneNumber",
    },
    {
      title: "Vai trò",
      key: "role",
      dataIndex: "role",
      render: (role) => (
        <>
          {role === "buyer"
            ? "Người mua"
            : role === "seller"
            ? "Người bán"
            : "Quản trị viên"}
        </>
      ),
    },
    {
      title: "Username",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "Mật khẩu",
      key: "password",
      dataIndex: "password",
    },
    {
      title: "Trạng thái",
      key: "deleted",
      dataIndex: "deleted",
      render: (deleted) => <>{deleted ? "Đã khóa" : "Khả dụng"}</>,
    },
    {
      title: "Hành động",
      key: "actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <button
            className="delete-btn"
            onClick={() => handleMoveToEdit(record)}
          >
            <DiffOutlined />
          </button>
          <button className="delete-btn">
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  const data = users.map((user) => {
    const temp = { ...user };
    var bytes = CryptoJS.AES.decrypt(temp.password, "secretkey");
    temp.password = bytes.toString(CryptoJS.enc.Utf8);
    temp.deleted = user.deleted ? true : false;
    return temp;
  });

  const handleClickDropdown = (e) => {
    const role = e.target.getAttribute("roleUser");
    dropdownRole.current = role;
    setLoading(true);
    axiosApi("/api/v1/admin/user", {
      params: { role: role },
    }).then((res) => {
      setUsers(res.data.data);
      setLoading(false);
    });
  };

  const dropdownItems = [
    {
      key: "buyer",
      label: (
        <div onClick={handleClickDropdown} roleUser="buyer">
          Người mua
        </div>
      ),
    },
    {
      key: "seller",
      label: (
        <div onClick={handleClickDropdown} roleUser="seller">
          Người bán
        </div>
      ),
    },
    {
      key: "admin",
      label: (
        <div onClick={handleClickDropdown} roleUser="admin">
          Quản trị viên
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row my-3">
        <h2 className="page-title">Quản lý tài khoản</h2>
      </div>

      <div className="row my-3 mx-4 justify-content-between">
        <div className="col-6">
          <Dropdown menu={{ items: dropdownItems, selectable: true }}>
            <button type="button" className="dropdown-button">
              <span>Vai trò</span>
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
        <div className="col-6">
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => {
              navigate("/admin/user/add");
            }}
          >
            + Thêm tài khoản
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

export default memo(User);
