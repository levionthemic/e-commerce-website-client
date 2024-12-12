import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor"; // Import thư viện
import Swal from "sweetalert2";
import "./ShopProfile.css";
import {
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaStore,
  FaInfoCircle,
} from "react-icons/fa";

const ShopProfile = () => {
  const [profile, setProfile] = useState({
    shopname: "Vãng Sinh Đường",
    description:
      "Vãng Sinh Đường là một doanh nghiệp có trụ sở tại Cảng Liyue. Cùng với việc chôn cất người chết, họ cũng thực hiện các nghi thức tang lễ cho các Tiên Nhân. Vãng Sinh Đường ban đầu được thành lập trong hoặc sau cuộc Chiến Tranh Ma Thần, khi các vị thần sa ngã hóa thân thành ma thần, Nham Vương Đế Quân đã cử Dạ Xoa đến bảo vệ thành phố Liyue. Kể từ đó, Vãng Sinh Đường đã tồn tại qua 77 thế hệ. Theo thời gian, Dạ Xoa đã tích lũy ngày càng nhiều oán niệm, một số oán niệm đã hóa thành một bệnh dịch càn quét Liyue, lấy đi nhiều sinh mạng trên đường đi của nó. Một số người sợ hải tin rằng đó là một lời nguyền từ các vị thần, nhưng một số ít khác nhận ra rằng bệnh dịch có thể được ngăn chặn bằng cách lọc sạch không khí và đốt những xác chết bị nhiễm bệnh đi. Những người này đã đi tiên phong trong việc dập tắt được dịch bệnh và cuối cùng họ đã thành lập Vãng Sinh Đường. Họ và những người kế thừa của họ đã và đang không mệt mỏi duy trì sự cân bằng giữa sự sống và cái chết. Vãng Sinh Đường ban đầu giống với một văn phong bác sĩ hơn là một dịch vụ tang lễ như ngày nay.",
    address: "Cảng Liyue",
    phone: "01389175257",
    email: "vangsinhduong@gmail.com",
    businessType: "Nghi thức",
    workingHours: "08:00 - 22:00 (Thứ 2 - Chủ Nhật)",
    establishedDate: "30/11/2021",
    featuredProduct: "Quan tài siêu sale giá rẻ",
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
    banner:
      "https://preview.redd.it/genshin-impact-x-galaxy-store-collaboration-hu-tao-edition-v0-j16puh4c0qlc1.png?width=3840&format=png&auto=webp&s=a1e4770c86b2dd3ea5e1588d563e79efcd19e7e0", // Add ảnh bìa mẫu
    avatar:
      "https://i.pinimg.com/736x/95/02/1d/95021d39f6cfc93508fd313864adc1ae.jpg", // Add ảnh đại diện mẫu
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState(null);  
  const [imageToEdit, setImageToEdit] = useState(null); 
  const [scale, setScale] = useState(1); 
  const editorRef = useRef(null); 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm lưu ảnh đã chỉnh sửa
  const saveEditedImage = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL(); // Xuất ảnh đã chỉnh sửa
      setProfile((prev) => ({
        ...prev,
        [editMode]: canvas, // Gán ảnh đã chỉnh sửa vào banner/avatar
      }));
      setEditMode(null); // Thoát chế độ chỉnh sửa
      setImageToEdit(null); // Reset ảnh
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToEdit(reader.result); // Gán ảnh được load vào state
        setEditMode(type); // "banner" hoặc "avatar"
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);
  {
    isModalOpen && (
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        aria-labelledby="updateSuccessModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateSuccessModal">
                Hồ sơ đã được cập nhật!
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body text-center">
              <p>Bạn đã cập nhật thông tin hồ sơ thành công.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setIsModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-profile">
      <h2>Thông tin cửa hàng</h2>
      {/* Phần chỉnh sửa ảnh */}
      {editMode && imageToEdit && (
        <div className="editor-overlay">
          <div className="editor-container">
            <AvatarEditor
              ref={editorRef}
              image={imageToEdit}
              width={editMode === "avatar" ? 150 : 1200}
              height={editMode === "avatar" ? 150 : 300}
              border={50}
              borderRadius={editMode === "avatar" ? 150 : 0}
              scale={scale}
              className="editor"
            />
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="scale-slider"
            />
            <div className="editor-buttons">
              <button className="btn save-btn" onClick={saveEditedImage}>
                Lưu
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => setEditMode(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-actions">
        {!isEditingProfile && (
          <button
            className="btn btn-primary"
            style={{ position: "absolute", right: "20px", top: "20px" }}
            onClick={() => setIsEditingProfile(true)}
          >
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      {/* Banner */}
      <div className="banner-container">
        <img src={profile.banner} alt="Shop Banner" className="banner-img" />
        {isEditingProfile && (
          <label htmlFor="banner-upload" className="change-banner">
            <i className="fas fa-camera"></i> {/* Icon thay đổi */}
          </label>
        )}
        <input
          id="banner-upload"
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleImageChange(e, "banner")}
        />
      </div>

      {/* Avatar */}
      <div className="avatar-container">
        <img src={profile.avatar} alt="Avatar" className="avatar-img" />
        {isEditingProfile && (
          <label htmlFor="avatar-upload" className="change-avatar">
            <i className="fas fa-camera"></i>
          </label>
        )}
        <input
          id="avatar-upload"
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleImageChange(e, "avatar")}
        />
      </div>

      {/* Tên cửa hàng */}
      <div className="shop-name-container">
        {isEditingProfile ? (
          <div className="card card-shop">
            <h5>
              <FaStore className="icon" /> Tên Shop
            </h5>
            <input
              type="text"
              id="shopname"
              className="form-control"
              name="shopname"
              value={profile.shopname}
              onChange={handleInputChange}
              placeholder="Nhập tên shop"
            />
          </div>
        ) : (
          <div className="display-shop-name">
            <h2>
              <FaStore className="icon-display" /> {profile.shopname}
            </h2>
          </div>
        )}
      </div>

      <div className="row">
        <div className="card card-shop">
          <h5>
            <FaInfoCircle className="icon" /> Mô tả Shop
          </h5>
          {isEditingProfile ? (
            <textarea
              className="form-control"
              name="description"
              value={profile.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả cho shop"
              rows="3"
            ></textarea>
          ) : (
            <p className={`description1 ${showFullDescription ? "full" : ""}`}>
              {profile.description}
            </p>
          )}
          {!isEditingProfile && profile.description.length > 100 && (
            <button
              className="btn btn-link"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      </div>

      {/* Thông tin cửa hàng */}
      <div className="shop-info">
        <div className="row">
          <div className="card card-shop">
            <h5>
              <FaBuilding className="icon" /> Địa chỉ
            </h5>
            {isEditingProfile ? (
              <input
                type="text"
                className="form-control"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profile.address}</p>
            )}
          </div>
          <div className="card card-shop">
            <h5>
              <FaPhone className="icon" /> Số điện thoại
            </h5>
            {isEditingProfile ? (
              <input
                type="text"
                className="form-control"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profile.phone}</p>
            )}
          </div>
          <div className="card card-shop">
            <h5>
              <FaEnvelope className="icon" /> Email
            </h5>
            {isEditingProfile ? (
              <input
                type="email"
                className="form-control"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nút chỉnh sửa */}
      <div className="text-center">
        {isEditingProfile ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsEditingProfile(false); // Tắt chế độ chỉnh sửa
              Swal.fire({
                icon: "success",
                title: "Cập nhật thành công!",
                text: "Hồ sơ của bạn đã được lưu lại.",
                showConfirmButton: false,
                timer: 2000, // Tự động đóng sau 2 giây
              });
            }}
          >
            Cập nhật hồ sơ
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsEditingProfile(false); // Tắt chế độ chỉnh sửa
              Swal.fire({
                icon: "success",
                title: "Cập nhật thành công!",
                text: "Hồ sơ của bạn đã được lưu lại.",
                showConfirmButton: false,
                timer: 2000,
              });
            }}
          >
            Cập nhật hồ sơ
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopProfile;
