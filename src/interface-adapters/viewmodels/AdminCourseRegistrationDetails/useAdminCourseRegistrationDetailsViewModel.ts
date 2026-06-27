import { useState, useEffect, useRef } from 'react';
import { CourseRegistrationStat } from '../../../domain/entities/CourseRegistrationStat';
import {
    getCourseRegistrationStatsUseCase,
    getClassesByCourseUseCase,
    deleteClassCourseUseCase,
} from '../../../di/admin.di';
import { Alert } from 'react-native';

/**
 * useAdminCourseRegistrationDetailsViewModel - ViewModel (MVVM)
 * Quản lý state và logic cho màn hình Chi tiết Đăng ký Học phần (Admin).
 *
 * Tuân thủ DIP: không tự khởi tạo AdminRepositoryImpl.
 * Thay vào đó sử dụng các use case đã được inject sẵn từ admin.di.ts.
 *
 * Tuân thủ SRP: chỉ quản lý state và điều phối action hiển thị thống kê đăng ký.
 */
export const useAdminCourseRegistrationDetailsViewModel = (semester: number | null, isVisible: boolean = true) => {
    const [stats, setStats] = useState<CourseRegistrationStat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
    const [expandedClasses, setExpandedClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);

    const [filterMaHp, setFilterMaHp] = useState('');
    const [filterTenHp, setFilterTenHp] = useState('');
    const [filterTruongKhoa, setFilterTruongKhoa] = useState('');
    const [filterSoLuong, setFilterSoLuong] = useState('');

    const loadStats = async (sem: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCourseRegistrationStatsUseCase.execute(sem);
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!semester) return;
        loadStats(semester);
    }, [semester]);

    // Refetch data khi màn hình trở lại visible (sau khi edit/create)
    const prevVisibleRef = useRef(isVisible);
    useEffect(() => {
        if (isVisible && !prevVisibleRef.current && semester) {
            loadStats(semester);
            // Nếu đang mở rộng 1 course, refetch danh sách lớp
            if (expandedCourseId) {
                loadClasses(expandedCourseId, semester);
            }
        }
        prevVisibleRef.current = isVisible;
    }, [isVisible]);

    const filteredStats = stats.filter(stat => {
        return (
            stat.ma_hp.toLowerCase().includes(filterMaHp.toLowerCase()) &&
            stat.ten_hp.toLowerCase().includes(filterTenHp.toLowerCase()) &&
            (stat.truong_khoa || '').toLowerCase().includes(filterTruongKhoa.toLowerCase()) &&
            stat.so_luong_dang_ky.toString().includes(filterSoLuong)
        );
    });

    const loadClasses = async (courseId: number, sem: number) => {
        setLoadingClasses(true);
        try {
            const classes = await getClassesByCourseUseCase.execute(courseId, sem);
            setExpandedClasses(classes);
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể tải danh sách lớp');
        } finally {
            setLoadingClasses(false);
        }
    };

    const toggleExpand = async (courseId: number) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
            setExpandedClasses([]);
            return;
        }

        setExpandedCourseId(courseId);
        await loadClasses(courseId, semester as number);
    };

    const deleteClass = async (classId: number) => {
        try {
            await deleteClassCourseUseCase.execute(classId);

            // Xoá thành công, loại khỏi danh sách hiện tại
            setExpandedClasses(prev => prev.filter(c => c.id !== classId));

            Alert.alert('Thành công', 'Đã xoá lớp học');
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể xoá lớp học');
        }
    };

    return {
        stats: filteredStats,
        loading,
        error,
        filterMaHp,
        setFilterMaHp,
        filterTenHp,
        setFilterTenHp,
        filterTruongKhoa,
        setFilterTruongKhoa,
        filterSoLuong,
        setFilterSoLuong,
        expandedCourseId,
        expandedClasses,
        loadingClasses,
        toggleExpand,
        deleteClass,
    };
};
