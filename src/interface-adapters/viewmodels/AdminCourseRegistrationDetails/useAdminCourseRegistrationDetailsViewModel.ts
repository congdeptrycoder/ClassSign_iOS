import { useState, useEffect } from 'react';
import { CourseRegistrationStat } from '../../../domain/entities/CourseRegistrationStat';
import { AdminRepositoryImpl } from '../../../infrastructure/repositories/AdminRepositoryImpl';
import { GetCourseRegistrationStatsUseCase } from '../../../application/use-cases/GetCourseRegistrationStatsUseCase';
import { GetClassesByCourseUseCase } from '../../../application/use-cases/GetClassesByCourseUseCase';
import { DeleteClassCourseUseCase } from '../../../application/use-cases/DeleteClassCourseUseCase';
import { Alert } from 'react-native';

/**
 * useAdminCourseRegistrationDetailsViewModel - ViewModel (MVVM)
 * Quản lý state và logic cho màn hình Chi tiết Đăng ký Học phần (Admin).
 */
export const useAdminCourseRegistrationDetailsViewModel = (semester: number | null) => {
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

    useEffect(() => {
        if (!semester) return;

        const loadStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const adminRepo = new AdminRepositoryImpl();
                const useCase = new GetCourseRegistrationStatsUseCase(adminRepo);
                const data = await useCase.execute(semester);
                setStats(data);
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu thống kê');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [semester]);

    const filteredStats = stats.filter(stat => {
        return (
            stat.ma_hp.toLowerCase().includes(filterMaHp.toLowerCase()) &&
            stat.ten_hp.toLowerCase().includes(filterTenHp.toLowerCase()) &&
            (stat.truong_khoa || '').toLowerCase().includes(filterTruongKhoa.toLowerCase()) &&
            stat.so_luong_dang_ky.toString().includes(filterSoLuong)
        );
    });

    const toggleExpand = async (courseId: number) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
            setExpandedClasses([]);
            return;
        }
        
        setExpandedCourseId(courseId);
        setLoadingClasses(true);
        try {
            const adminRepo = new AdminRepositoryImpl();
            const useCase = new GetClassesByCourseUseCase(adminRepo);
            const classes = await useCase.execute(courseId, semester as number);
            setExpandedClasses(classes);
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể tải danh sách lớp');
        } finally {
            setLoadingClasses(false);
        }
    };

    const deleteClass = async (classId: number) => {
        try {
            const adminRepo = new AdminRepositoryImpl();
            const useCase = new DeleteClassCourseUseCase(adminRepo);
            await useCase.execute(classId);
            
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
