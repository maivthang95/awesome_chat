export const transValidation = {
  email_incorrect : "Dia chi email khong hop le" , 
  gender_incorrect : "Gioi tinh da bi thay doi" , 
  password_incorrect : "Mat khau phai co it nhat 8 ky tu ,gom chu thuong , chu hoa , so va ky tu" ,
  password_confirmation_incorrect : "Mat khau nhap lai khong trung khop"
};

export const transErrors = {
  account_in_use : "Email da duoc su dung" ,
  account_removed : "Tai khoan da bi xoa" ,
  account_not_active : "Tai khoan chua duoc kich hoat , vui long truy cap email cua ban de kich hoat ",
  token_undifined : "Token khong ton tai",
  login_failed :  "Sai tai khoan hoac mat khau",
  server_error : "Co loi tu he thong, vui long thu lai"
};

export const transSuccess = {
  userCreated : (userEmail) => {
    return `Tai khoan <strong> ${userEmail} </strong> da duoc tao, vui long kiem tra email de kich hoat tai khoan truoc khi dang nhap` 
  },
  account_active : "Kich hoat tai khoan thanh cong, ban da co the dang nhap vao ung dung",
  login_success : (username) => `Xin chao ${username} , chao mung ban da den voi Awesome Chat`,
  logout_success : `Dang xuat tai khoan thanh cong`
}

export const transMail = {
  subject : "Awesome Chat: Xac nhan kich hoat tai khoan",
  template : (linkVerify) => {
    return `
      <h2>Bạn nhận được email này vì đã đăng kí tài khoản trên awesome Chat</h2>
      <h3>Vui lòng click vào liên kết bên dưới để  xác nhận kích hoạt tài khoản</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu tin rằng email này nhầm lẫn, vui lòng bỏ qua</h4>
    `
  },
  send_fail : "Có lỗi trong quá trình gửi email , vui lòng liên hệ bộ phận hỗ trợ của chúng tôi"
}
