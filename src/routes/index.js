import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OTPConfirm from "../pages/Auth/OTPConfirm";
import ResetPassword from "../pages/Auth/ResetPassword";

import Home from "../pages/Buyer/Home";
import SearchPage from "../pages/Buyer/SearchPage";
import UserInfo from "../pages/Buyer/User/UserInfo";
import CartPage from "../pages/Buyer/CartPage";
import DetailProduct from "../pages/Buyer/DetailProduct";
import UserOrder from "../pages/Buyer/User/UserOrder";
import Checkout from "../pages/Buyer/Checkout";

import ShopOverview from "../pages/Shoper/ShopOverview";
import ShopProfle from "../pages/Shoper/ShopProfile";
import ManageOrders from "../pages/Shoper/ManageOrders";
import ManageProducts from "../pages/Shoper/ManageProducts";
import AddProduct from "../pages/Shoper/ManageProducts/AddProduct";
import EditProduct from "../pages/Shoper/ManageProducts/EditProduct";

import Account from "../pages/Admin/Account";
import LoginLog from "../pages/Admin/LoginLog";
import Category from "../pages/Admin/Category";
import EditCategory from "../pages/Admin/Category/EditCategory";
import Product from "../pages/Admin/Product";
import AddProduct_Admin from "../pages/Admin/Product/AddProduct";
import EditProduct_Admin from "../pages/Admin/Product/EditProduct";
import User from "../pages/Admin/User";
import AddUser from "../pages/Admin/User/AddUser";
import EditUser from "../pages/Admin/User/EditUser";
import Config from "../pages/Admin/Config";

import Page404 from "../pages/Page404";

import { prefixAdmin } from "../config/system";

export const routes = [
  // Các route dành cho khách hàng
  {
    path: "/",
    page: Home,
    isShowHeader: true,
    isAuthorized: true,
  },
  {
    path: "/auth/login",
    page: Login,
    isShowHeader: false,
    isAuthorized: false,
  },
  {
    path: "/auth/signup",
    page: Signup,
    isShowHeader: false,
    isAuthorized: false,
  },
  {
    path: "/auth/forgot-password",
    page: ForgotPassword,
    isShowHeader: false,
    isAuthorized: false,
  },
  {
    path: "/auth/otp-confirm",
    page: OTPConfirm,
    isShowHeader: false,
    isAuthorized: false,
  },
  {
    path: "/auth/reset-password",
    page: ResetPassword,
    isShowHeader: false,
    isAuthorized: false,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
    isAuthorized: true,
  },
  {
    path: "/search",
    page: SearchPage,
    isShowHeader: true,
    isAuthorized: true,
  },
  {
    path: "/user/info",
    page: UserInfo,
    isShowHeader: true,
    isAuthorized: true,
  },
  {
    path: "/detailproduct/:productId",
    page: DetailProduct,
    isShowHeader: true,
    isAuthorized: true,
  },
  {
    path: "/user/order",
    page: UserOrder,
    isShowHeader: true,
    isAuthorized: true,
  },
  {
    path: "/checkout",
    page: Checkout,
    isShowHeader: true,
    isAuthorized: true,
  },

  // Admin Routes
  {
    path: `${prefixAdmin}/account`,
    page: Account,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/login-log`,
    page: LoginLog,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/category`,
    page: Category,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/category/edit`,
    page: EditCategory,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/product`,
    page: Product,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/product/add`,
    page: AddProduct_Admin,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/product/edit`,
    page: EditProduct_Admin,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/user`,
    page: User,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/user/add`,
    page: AddUser,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/user/edit`,
    page: EditUser,
    role: "admin",
    isAuthorized: true,
  },
  {
    path: `${prefixAdmin}/config`,
    page: Config,
    role: "admin",
    isAuthorized: true,
  },

  // Các route dành cho người bán
  {
    path: "/shop/overview",
    page: ShopOverview,
    isShowHeader: false,
    isAuthorized: true,
    role: "seller",
  },
  {
    path: "/shop/products/add",
    page: AddProduct,
    isShowHeader: false,
    isAuthorized: true,
    role: "seller",
  },
  {
    path: "/shop/products",
    page: ManageProducts,
    isShowHeader: false,
    isAuthorized: true,
    role: "seller",
  },
  {
    path: "/shop/orders",
    page: ManageOrders,
    isShowHeader: false,
    isAuthorized: true,
    role: "seller",
  },
  {
    path: "/shop/profile",
    page: ShopProfle,
    isShowHeader: false,
    isAuthorized: true,
    role: "seller",
  },
  {
    path: "/shop/products/edit",
    page: EditProduct,
    isShowHeader: false,
    isAuthorized: true,
    role: "seller",
  },

  // 404
  {
    path: "*",
    page: Page404,
  },
];
