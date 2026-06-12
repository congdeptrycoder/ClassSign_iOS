/**
 * CourseRegistrationStat - Domain Entity
 * Thống kê số lượng sinh viên đăng ký theo học phần trong một học kỳ.
 */
export class CourseRegistrationStat {
    constructor(
        public readonly course_id: number,
        public readonly ma_hp: string,
        public readonly ten_hp: string,
        public readonly truong_khoa: string,
        public readonly so_luong_dang_ky: number,
        public readonly so_luong_lop: number,
        public readonly so_luong_dk_toi_da: number
    ) {}
}
