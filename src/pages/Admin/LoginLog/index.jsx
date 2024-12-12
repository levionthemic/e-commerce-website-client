import { Table } from "antd";
import { memo, useEffect, useState } from "react";
import { axiosApi } from "../../../services/UserService";

function LoginLog() {
  const [loading, setLoading] = useState();
  const [loginLogs, setLoginLogs] = useState();
  const [users, setUsers] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosApi.get("/api/v1/admin/login-log")
      .then(res => {
        setLoginLogs(res.data.loginLogs);
        setUsers(res.data.users);
        setLoading(false);
      })
  }, [])

  const columns = [
    {
      title: "STT",
      key: "stt",
      dataIndex: "stt",
    },
    {
      title: "ID tài khoản",
      key: "userId",
      dataIndex: "userId",
    },
    {
      title: "Tên người dùng",
      key: "fullname",
      dataIndex: "fullname",
    },
    {
      title: "Vai trò",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Thời gian đăng nhập",
      key: "time",
      dataIndex: "time",
    },
  ];
  const data = loginLogs?.map((loginLog, index) => ({
    stt: index + 1,
    userId: loginLog.userId,
    fullname: users[index].fullname,
    role: users[index].role,
    time: new Date(loginLog.createdAt).toLocaleString("vi-VN"),
  }));

  return (
    <div className="container-fluid">
      <div className="row my-3">
        <div className="col-12">
          <h2>Lịch sử đăng nhập</h2>
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

export default memo(LoginLog);
