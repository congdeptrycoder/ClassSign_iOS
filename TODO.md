# TODO

- [x] Điều chỉnh cấu trúc thư mục của dự án theo Clean Architecture và MVVM
- [x] Cập nhật giao diện LoginScreen (Gradient, Logo, Styled components) - FIXED: missing styles
- [x] Tạo giao diện StudentDashboard theo yêu cầu và thiết lập điều hướng cơ bản từ LoginScreen
- [x] Tạo giao diện AdminDashboard (Thông tin lớp học) và AdminEditClass (Chỉnh sửa) theo yêu cầu, tạo viewmodels và viết Unit tests
- [x] Chuyển logic điều hướng từ App.tsx vào navigation/AppNavigator.tsx và tập trung styles dùng chung vào components/shared-styles.ts
- [x] Thêm tính năng Dark/Light Mode: ThemeContext (Observer Pattern), createXxxStyles(colors) factory functions (Strategy Pattern), nút toggle ☀️/🌙 tại LoginScreen, áp dụng theme xuyên suốt tất cả màn hình qua useTheme() hook
- [x] Sửa lỗi runtime error `DOMException` và cấu hình đồng bộ phiên bản Babel Preset với cấu hình Mock cho Jest tests
- [x] Tạo Express.js server (port 3001) kết nối SQLite tại App_MACOS, khởi động song song với `npm start`. Refactor đăng nhập từ hardcode sang bảng `accounts` trong DB. Thêm config IP tự động cho Expo Go trên thiết bị thật. Viết 8 unit tests (LoginUseCase + AccountRepositoryImpl) - ALL PASSED.
- [x] Điều chỉnh giao diện thông báo lỗi đăng nhập: nền vàng (#FFD700), chữ trắng (#ffffff), fontWeight 500
- [x] Thêm hiệu ứng animation khi đăng nhập thành công: Animated.View bao quanh TextInputs, viền chuyển từ màu ban đầu sang xanh lá (#00B050) trong 0.3s (username trước, password sau), sau animation xong thì navigate sang giao diện role
