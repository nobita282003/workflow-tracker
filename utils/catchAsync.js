// Bọc các hàm async controller để tự động bắt lỗi và chuyển tiếp đến middleware xử lý lỗi
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
