import { Spin } from "antd";
import React from "react";

const Loading = ({ isLoading }) => {
  return (
    <Spin spinning={isLoading} delay={200} />
  );
};

export default Loading;