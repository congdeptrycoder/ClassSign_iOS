import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { RegisterCourse } from '../../../application/use-cases/RegisterCourse';
import { GetActiveRegistrationPhase } from '../../../application/use-cases/GetActiveRegistrationPhase';
import { RegistrationPhaseRepositoryImpl } from '../../../infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import { Course } from '../../../domain/entities/Course';
import { logMessage } from '../../../shared/utils/logger';

export interface RegisteredSubject {
    id: string;
    code: string;
    name: string;
    status: string;
    credits: number;
}

export interface TimeEvent {
    day: string;
    period: number;
    name: string;
}

export const useStudentDashboardViewModel = (onLogout: () => void) => {
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePhase, setActivePhase] = useState<RegistrationPhase | null>(null);
    const [registeredSubjects, setRegisteredSubjects] = useState<RegisteredSubject[]>([
        {
            id: '1',
            code: 'IT3040',
            name: 'Kỹ thuật phần mềm',
            status: 'Thành công',
            credits: 3,
        },
        {
            id: '2',
            code: 'IT3020',
            name: 'Toán rời rạc',
            status: 'Thành công',
            credits: 3,
        },
        {
            id: '3',
            code: 'IT4060',
            name: 'Thiết kế hệ thống mạng',
            status: 'Thành công',
            credits: 3,
        },
    ]);

    const registerUseCase = new RegisterCourse();

    // Đăng ký observer nhận cập nhật từ RegistrationPhaseRepository
    useEffect(() => {
        const phaseRepository = RegistrationPhaseRepositoryImpl.getInstance();
        const getActivePhaseUseCase = new GetActiveRegistrationPhase();
        const unsubscribe = phaseRepository.subscribe((phases) => {
            // Tính toán active phase từ dữ liệu lấy được, không gọi lại repo để tránh loop
            const currentActive = getActivePhaseUseCase.execute(phases);
            setActivePhase(currentActive);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const toggleUserInfo = () => {
        setIsUserInfoVisible(currentValue => !currentValue);
    };

    const handleLogout = () => {
        setIsUserInfoVisible(false);
        onLogout();
    };

    // Mở trang fed.hust.edu.vn trên trình duyệt
    const handleViewCurriculum = async () => {
        const url = 'https://fed.hust.edu.vn';
        logMessage('INFO', `Yêu cầu xem chương trình đào tạo: ${url}`);
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
                logMessage('INFO', `Đã mở URL thành công: ${url}`);
            } else {
                logMessage('WARN', `Không thể mở URL: ${url}`);
                Alert.alert('Lỗi', `Thiết bị không hỗ trợ mở liên kết: ${url}`);
            }
        } catch (error) {
            logMessage('ERROR', `Lỗi khi mở URL: ${url}`, error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi mở trình duyệt.');
        }
    };

    // Đăng ký học phần
    const handleRegisterSubject = () => {
        logMessage('INFO', `Yêu cầu đăng ký học phần với query: "${searchQuery}"`);
        try {
            const newSubject = registerUseCase.execute(searchQuery, registeredSubjects);
            setRegisteredSubjects(prev => [...prev, newSubject]);
            setSearchQuery('');
            logMessage('INFO', `Đăng ký học phần thành công: ${newSubject.code} - ${newSubject.name}`);
            Alert.alert('Thành công', `Đăng ký thành công học phần: ${newSubject.name} (${newSubject.code})`);
        } catch (error: any) {
            const errorMsg = error.message || 'Đăng ký học phần thất bại';
            logMessage('WARN', `Đăng ký thất bại: ${errorMsg}`);
            Alert.alert('Cảnh báo', errorMsg);
        }
    };

    // Chọn nhanh học phần từ danh sách gợi ý đề xuất
    const handleSelectSuggestion = (course: Course) => {
        setSearchQuery(course.code);
        logMessage('INFO', `Đã chọn học phần gợi ý: ${course.code}`);
    };

    // Lọc danh sách học phần gợi ý dựa theo searchQuery
    const allowedSuggestions: Course[] = searchQuery.trim()
        ? registerUseCase.getAllowedCourses().filter(course => {
            const query = searchQuery.trim().toLowerCase();
            const isMatch = course.code.toLowerCase().includes(query) ||
                          course.name.toLowerCase().includes(query);
            // Chỉ gợi ý nếu chưa được đăng ký
            const isNotRegistered = !registeredSubjects.some(
                reg => reg.code.toLowerCase() === course.code.toLowerCase()
            );
            return isMatch && isNotRegistered;
        })
        : [];

    const timeGridEvents: TimeEvent[] = [
        { day: 'T2', period: 1, name: 'IT3040' },
        { day: 'T2', period: 2, name: 'IT3040' },
        { day: 'T3', period: 3, name: 'IT3020' },
        { day: 'T3', period: 4, name: 'IT3020' },
        { day: 'T5', period: 7, name: 'IT4060' },
        { day: 'T5', period: 8, name: 'IT4060' },
    ];

    return {
        isUserInfoVisible,
        toggleUserInfo,
        searchQuery,
        setSearchQuery,
        handleRegisterSubject,
        handleViewCurriculum,
        handleLogout,
        registeredSubjects,
        timeGridEvents,
        activePhase,
        allowedSuggestions,
        handleSelectSuggestion,
    };
};
