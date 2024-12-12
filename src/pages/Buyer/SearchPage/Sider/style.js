import { Menu } from "antd";
import styled from "styled-components";

export const StyledMenu = styled(Menu)`
  .ant-menu-submenu {
    border-bottom: 1px solid #ddd;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &:last-child {
      border-bottom: 0;
    }
  }
  .ant-menu-submenu-title {
    height: 30px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Lexend", sans-serif;
  }

  .ant-menu-item-only-child {
    height: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Lexend", sans-serif;

    .ant-menu-title-content {
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: "Lexend", sans-serif;
    }
  }
`;