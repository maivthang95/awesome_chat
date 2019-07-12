export const transValidation = {
  email_incorrect : "Dia chi email khong hop le" , 
  gender_incorrect : "Gioi tinh da bi thay doi" , 
  password_incorrect : "Mat khau phai co it nhat 8 ky tu ,gom chu thuong , chu hoa , so va ky tu" ,
  password_confirmation_incorrect : "Mat khau nhap lai khong trung khop"
};

export const transErrors = {
  account_in_use : "Email da duoc su dung" ,
  account_removed : "Tai khoan da bi xoa" ,
  account_not_active : "Tai khoan chua duoc kich hoat , vui long truy cap email cua ban de kich hoat "
};

export const transSuccess = {
  userCreated : (userEmail) => {
    return `Tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra email de kich hoat tai khoan truoc khi dang nhap` 
  }
}
