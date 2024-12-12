import styled from "styled-components";
import { Tabs, Input } from "antd";

export const StyledTabs = styled(Tabs)`
  .ant-tabs {
    gap: 60px;
  }
  .ant-tabs-nav {
    justify-content: space-between;
    background: white;
    border-radius: 5px;
  }
  .ant-tabs-nav .ant-tabs-nav-list {
    justify-content: space-between;
    width: 100%;
  }
  .ant-tabs-nav .ant-tabs-nav-list .ant-tabs-tab {
    width: calc(100% / 6);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-tabs-nav .ant-tabs-nav-list .ant-tabs-tab .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 50%);
    font-size: 16px;
    font-family: "Lexend", sans-serif;
  }
  .ant-tabs-nav .ant-tabs-nav-list .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: black;
    font-weight: 500;
  }
  .ant-tabs-nav .ant-tabs-nav-list .ant-tabs-ink-bar {
    background: black;
  }
`;

export const StyledInput = styled(Input)`
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  &:hover {
    border-color: black;
  }
  &:focus {
    border-color: black;
    box-shadow: none;
  }
`;
