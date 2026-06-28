# Báo cáo Unit Test

Dưới đây là bảng tổng hợp các test case nổi bật đã được thực hiện và kiểm thử trong dự án.

## 1. Tài khoản Admin

| ID | Tên test case | Layer | Hàm được test | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC_AD01 | Tổng hợp sinh viên đăng ký theo học kỳ | Use Case | GetCourseRegistrationStatsUseCase | Trả về danh sách thống kê số lượng đăng ký chính xác | Pass |
| TC_AD02 | Lấy danh sách học kỳ | Use Case | GetSemestersUseCase | Trả về danh sách học kỳ hiện có trong hệ thống | Pass |
| TC_AD03 | Tạo học kỳ mới | Use Case | CreateSemesterUseCase | Gọi repository để tạo học kỳ mới với mã hợp lệ | Pass |
| TC_AD04 | Lấy danh sách các đợt đăng ký | Use Case | GetRegistrationPhasesUseCase | Trả về danh sách các đợt đăng ký đang có | Pass |
| TC_AD05 | Thêm đợt đăng ký mới | Use Case | AddRegistrationPhaseUseCase | Thêm thành công và trả về dữ liệu đợt đăng ký (kèm ID) | Pass |
| TC_AD06 | Cập nhật thông tin đợt đăng ký | Use Case | UpdateRegistrationPhaseUseCase | Cập nhật thời gian và thông tin đợt đăng ký thành công | Pass |
| TC_AD07 | Xóa đợt đăng ký | Use Case | DeleteRegistrationPhaseUseCase | Xóa đợt đăng ký dựa trên ID thành công | Pass |
| TC_AD08 | Tạo lớp học phần mới | Use Case | CreateClassCourseUseCase | Tạo lớp học thành công cho một học phần cụ thể | Pass |
| TC_AD09 | Lấy danh sách lớp theo học phần | Use Case | GetClassesByCourseUseCase | Trả về chính xác các lớp thuộc về học phần đã chọn | Pass |
| TC_AD10 | Khởi tạo dữ liệu Admin Dashboard | ViewModel | useAdminDashboardViewModel | Hook tự động load danh sách học kỳ và đợt đăng ký khi khởi tạo | Pass |

## 2. Tài khoản Student - Đợt đăng ký học phần

| ID | Tên test case | Layer | Hàm được test | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC_ST01 | Lấy thông tin chương trình đào tạo | Use Case | GetCurriculumUseCase | Trả về dữ liệu CTĐT của sinh viên đang theo học | Pass |
| TC_ST02 | Lấy danh sách học phần đã đăng ký | Use Case | GetRegisteredCoursesUseCase | Trả về danh sách học phần sinh viên đã đăng ký trong đợt | Pass |
| TC_ST03 | Tìm kiếm gợi ý học phần | Use Case | SearchCourseSuggestionsUseCase | Trả về danh sách học phần gợi ý khớp với từ khóa | Pass |
| TC_ST04 | Đăng ký học phần mới | Use Case | RegisterCourseUseCase | Gọi repository đăng ký học phần thành công | Pass |
| TC_ST05 | Hủy đăng ký học phần | Use Case | CancelCourseRegistrationUseCase | Xóa học phần khỏi danh sách đã đăng ký thành công | Pass |
| TC_ST06 | Gửi yêu cầu đăng ký qua Controller | Controller | CourseRegistrationController | Chuyển tiếp chính xác tham số từ Client xuống Use Case | Pass |
| TC_ST07 | Xử lý thông báo đăng ký quá giới hạn tín chỉ | ViewModel | useCourseRegistrationViewModel | Hiển thị Popup cảnh báo khi tổng số tín chỉ vượt quá giới hạn | Pass |

## 3. Tài khoản Student - Đợt đăng ký lớp học

| ID | Tên test case | Layer | Hàm được test | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC_ST08 | Tìm kiếm lớp học phần | Use Case | SearchClassSuggestionsUseCase | Trả về danh sách gợi ý lớp học phần khớp với từ khóa | Pass |
| TC_ST09 | Lấy danh sách lớp theo học phần | Use Case | GetCourseClassesUseCase | Trả về toàn bộ danh sách lớp của một học phần cụ thể | Pass |
| TC_ST10 | Đăng ký lớp học phần | Use Case | RegisterClassUseCase | Gửi request đăng ký lớp học thành công tới Repository | Pass |
| TC_ST11 | Hủy đăng ký lớp học phần | Use Case | CancelClassRegistrationUseCase | Gọi API xóa đăng ký lớp học thành công | Pass |
| TC_ST12 | Quản lý đóng/mở danh sách lớp | ViewModel | useClassRegistrationViewModel | Thu gọn/mở rộng danh sách lớp theo từng học phần chính xác | Pass |
| TC_ST13 | Xử lý Alert xác nhận hủy lớp | ViewModel | useClassRegistrationViewModel | Hiển thị thông báo yêu cầu xác nhận hủy lớp và xử lý luồng khi ấn Xác nhận | Pass |

## 4. Cấu trúc thư mục Test

Toàn bộ các file kiểm thử được đặt trong thư mục `tests/` tại thư mục gốc của dự án, tuân thủ đúng theo mô hình **Clean Architecture**:

```text
tests/
├── application/
│   └── use-cases/
│       ├── admin/          # Chứa các unit test cho các Use Case của Admin (VD: Quản lý đợt đăng ký, học kỳ...)
│       └── student/        # Chứa các unit test cho các Use Case của Sinh viên (VD: Đăng ký học phần, đăng ký lớp học...)
│
├── infrastructure/
│   └── repositories/       # Chứa test cho Repository (Mô phỏng gọi API thực tế tới Backend thông qua apiClient)
│
├── interface-adapters/
│   ├── controllers/        # Chứa test cho Controller (Trung gian nhận dữ liệu, điều phối tới các Use Case tương ứng)
│   └── viewmodels/         # Chứa test cho ViewModel (MVVM) - Kiểm thử logic hiển thị, quản lý state UI bằng React Hooks
│
└── presentation/
    └── components/         # Chứa test cho các Component UI dùng chung (VD: ThemeContext, Nút bấm, Layout...)
```
