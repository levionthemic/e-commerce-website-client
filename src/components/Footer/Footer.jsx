import React, { useState } from "react";
import "./Footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Customer Support */}
        <div className="footer__section">
          <h3>Chăm sóc khách hàng</h3>
          <ul className="list-unstyled">
            <li>
              <a href="/help">Trung tâm trợ giúp</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/mall">Mall</a>
            </li>
            <li>
              <a href="/guide">Hướng dẫn mua hàng</a>
            </li>
            <li>
              <a href="/returns">Trả hàng & hoàn tiền</a>
            </li>
          </ul>
        </div>

        {/* About Us */}
        <div className="footer__section">
          <h3>Về chúng tôi</h3>
          <ul className="list-unstyled">
            <li>
              <a href="/about">Giới thiệu về công ty</a>
            </li>
            <li>
              <a href="/careers">Tuyển dụng</a>
            </li>
            <li>
              <a href="/terms">Điều khoản sử dụng</a>
            </li>
            <li>
              <a href="/privacy">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__section">
          <h3>Liên hệ</h3>
          <p>Địa chỉ: Số 123, Đường ABC, Thành phố XYZ</p>
          <p>Điện thoại: 0123 456 789</p>
          <p>Email: support@example.com</p>
        </div>

        {/* Follow Us */}
        <div className="footer__section">
          <h3>Theo dõi chúng tôi</h3>
          <div className="footer__social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook /> <span>Facebook</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram /> <span>Instagram</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter /> <span>Twitter</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube /> <span>YouTube</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer__section">
          <h3>Đăng ký nhận tin</h3>
          {submitted ? (
            <p>Cảm ơn bạn đã đăng ký! Hãy kiểm tra email để xác nhận.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="footer__email-form">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
              />
              <button type="submit">Đăng ký</button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer__bottom">
        <p>© 2024 Công ty TNHH FKCJ. Tất cả các quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
