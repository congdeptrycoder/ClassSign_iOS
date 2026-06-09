import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import { RegistrationPhaseRepositoryImpl } from '../../../infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { ManageRegistrationPhases } from '../../../application/use-cases/ManageRegistrationPhases';
import { logMessage } from '../../../shared/utils/logger';
import { apiClient } from '../../../infrastructure/api/apiClient';

export interface SemesterInfo {
    id: number;
    semester: number;
}

export interface ClassInfo {
    ky: string;
    khoa_truong: string;
    ma_lop: string;
    ma_lop_kem: string;
    ma_hp: string;
    ten_hp: string;
    khoi_luong: string;
    ghi_chu: string;
    tiet_bd: string;
    tiet_kt: string;
    buoi: string;
    phong_hoc: string;
    can_tn: string;
    sl_dk: string;
    sl_max: string;
    trang_thai: string;
    teaching_type: string;
}

const majorMapping: Record<string, string[]> = {
    'Trường CNTT & TT': [
        'KHMT',
        'KTPM',
        'HTTT',
        'An toàn TT',
        'Trí tuệ nhân tạo',
        'Khoa học Dữ liệu',
    ],
    'Trường Điện - Điện tử': [
        'Kỹ thuật Điện',
        'Kỹ thuật Điều khiển',
        'Điện tử viễn thông',
    ],
    'Trường Cơ khí': ['Cơ điện tử', 'Kỹ thuật Cơ khí', 'Kỹ thuật Ô tô'],
    'Trường Kinh tế': [
        'Quản trị kinh doanh',
        'Kế toán',
        'Tài chính - Ngân hàng',
    ],
    'Trường Vật liệu': ['Kỹ thuật vật liệu', 'Vật liệu điện tử'],
    'Trường Hoá và Khoa học sự sống': [
        'Kỹ thuật hoá học',
        'Công nghệ sinh học',
        'Kỹ thuật môi trường',
    ],
    'Khoa Ngoại ngữ': ['Ngôn ngữ Anh'],
    'Khoa Toán-Tin': ['Toán tin', 'Hệ thống thông tin quản lý'],
    'Khoa KH&CNGD': [
        'Công nghệ giáo dục',
        'Quản lý giáo dục',
        'Tâm lý học tổ chức và doanh nghiệp',
    ],
    'Khoa Vật lý kỹ thuật': ['Vật lý kỹ thuật', 'Kỹ thuật hạt nhân'],
};

export const useAdminDashboardViewModel = (
    onNavigateToEdit?: (item: ClassInfo) => void,
    onLogout?: () => void,
) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('Mã lớp');
    const [isModeModalOpen, setModeModalOpen] = useState(false);
    const [department, setDepartment] = useState('');
    const [isDeptModalOpen, setDeptModalOpen] = useState(false);
    const [major, setMajor] = useState('');
    const [isMajorModalOpen, setMajorModalOpen] = useState(false);
    const [classesData, setClassesData] = useState<ClassInfo[]>([
        {
            ky: '20261',
            khoa_truong: 'Khoa KH&CNGD',
            ma_lop: '360018',
            ma_lop_kem: '888888',
            ma_hp: 'AC2020',
            ten_hp: 'Đồ hoạ hình động 2D,3D',
            khoi_luong: '3(3-1-0-6)',
            ghi_chu: 'Công nghệ giáo dục 02 K68',
            tiet_bd: '1',
            tiet_kt: '3',
            buoi: 'Sáng',
            phong_hoc: 'C7-111',
            can_tn: 'NULL',
            sl_dk: '51',
            sl_max: '60',
            trang_thai: 'Mở ĐK',
            teaching_type: '',
        },
    ]);

    // ── Giai đoạn đăng ký (Phases) states ────────────────────────────────────
    const [phases, setPhases] = useState<RegistrationPhase[]>([]);
    const [phaseType, setPhaseType] = useState<'course' | 'class'>('course');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [semesterId, setSemesterId] = useState<number | null>(null);
    const [semestersList, setSemestersList] = useState<SemesterInfo[]>([]);
    const [isSemesterModalOpen, setSemesterModalOpen] = useState(false);
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

    const phaseRepository = RegistrationPhaseRepositoryImpl.getInstance();
    const managePhasesUseCase = new ManageRegistrationPhases(phaseRepository);

    // Subscribe vào phase repository (Observer Pattern)
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const semesters = await apiClient.get<SemesterInfo[]>('/semesters');
                setSemestersList(semesters);
            } catch (error) {
                logMessage('ERROR', 'Failed to fetch semesters', error);
                setSemestersList([]);
            }
        };
        fetchSemesters();

        const unsubscribe = phaseRepository.subscribe(updatedPhases => {
            setPhases(updatedPhases);
        });
        return () => {
            unsubscribe();
        };
    }, [phaseRepository]);

    const toggleProfile = () => {
        setIsProfileOpen(currentValue => !currentValue);
    };

    const handleLogout = () => {
        setIsProfileOpen(false);
        onLogout?.();
    };

    const handleUpload = () => {
        Alert.alert('Upload', 'Chức năng upload file (.xlsx) sẽ được thực hiện.');
    };

    const handleSearch = () => {
        Alert.alert('Tìm kiếm', `Đang tìm kiếm: ${searchQuery} theo ${searchMode}`);
    };

    const handleEdit = (item: ClassInfo) => {
        if (onNavigateToEdit) {
            onNavigateToEdit(item);
            return;
        }

        Alert.alert(
            'Chuyển hướng',
            'Sẽ chuyển sang màn hình sửa với thông tin tương ứng.',
        );
    };

    const handleDelete = (item: ClassInfo) => {
        Alert.alert(
            'Xác nhận xoá',
            `Bạn có chắc chắn muốn xoá lớp ${item.ma_lop}?`,
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xoá',
                    style: 'destructive',
                    onPress: () => {
                        setClassesData(currentItems =>
                            currentItems.filter(classItem => classItem.ma_lop !== item.ma_lop),
                        );
                    },
                },
            ],
        );
    };

    const handleSelectDepartment = (selectedDepartment: string) => {
        setDepartment(selectedDepartment);
        setMajor('');
        setDeptModalOpen(false);
    };

    // ── Giai đoạn đăng ký (Phases) actions ───────────────────────────────────
    const handleSavePhase = async () => {
        if (!semesterId) {
            Alert.alert('Lỗi', 'Vui lòng chọn Học kỳ.');
            return;
        }

        logMessage('INFO', `Lưu giai đoạn thiết lập: type=${phaseType}, start=${startTime}, end=${endTime}, editId=${editingPhaseId}`);
        try {
            if (editingPhaseId) {
                // Update phase
                await managePhasesUseCase.updatePhase({
                    id: editingPhaseId,
                    type: phaseType,
                    startTime,
                    endTime,
                    semesterId
                });
                logMessage('INFO', `Cập nhật giai đoạn đăng ký thành công: ID=${editingPhaseId}`);
                Alert.alert('Thành công', 'Đã cập nhật thiết lập giai đoạn đăng ký thành công.');
            } else {
                // Create phase
                const newPhase = await managePhasesUseCase.addPhase({
                    type: phaseType,
                    startTime,
                    endTime,
                    semesterId
                });
                logMessage('INFO', `Thêm giai đoạn đăng ký mới thành công: ID=${newPhase.id}`);
                Alert.alert('Thành công', 'Đã thiết lập giai đoạn đăng ký thành công.');
            }
            // Clear form
            resetPhaseForm();
        } catch (error: any) {
            const errorMsg = error.message || 'Lỗi khi lưu giai đoạn thiết lập';
            logMessage('ERROR', `Lưu giai đoạn thất bại: ${errorMsg}`);
            Alert.alert('Lỗi', errorMsg);
        }
    };

    const handleEditPhase = (phase: RegistrationPhase) => {
        logMessage('INFO', `Bắt đầu sửa giai đoạn: ID=${phase.id}`);
        setEditingPhaseId(phase.id);
        setPhaseType(phase.type);
        setStartTime(phase.startTime);
        setEndTime(phase.endTime);
        setSemesterId(phase.semesterId);
    };

    const handleDeletePhase = (id: string) => {
        logMessage('INFO', `Yêu cầu xoá giai đoạn: ID=${id}`);
        Alert.alert(
            'Xác nhận xoá',
            'Bạn có chắc chắn muốn xoá thiết lập giai đoạn đăng ký này?',
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xoá',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await managePhasesUseCase.deletePhase(id);
                            logMessage('INFO', `Đã xoá giai đoạn thành công: ID=${id}`);
                            Alert.alert('Thành công', 'Đã xoá thiết lập giai đoạn đăng ký.');
                            if (editingPhaseId === id) {
                                resetPhaseForm();
                            }
                        } catch (error: any) {
                            logMessage('ERROR', `Xoá giai đoạn thất bại: ID=${id}`, error);
                            Alert.alert('Lỗi', 'Không thể xoá thiết lập này.');
                        }
                    }
                }
            ]
        );
    };

    const handleCancelEdit = () => {
        logMessage('INFO', 'Hủy chế độ sửa giai đoạn');
        resetPhaseForm();
    };

    const resetPhaseForm = () => {
        setEditingPhaseId(null);
        setPhaseType('course');
        setStartTime('');
        setEndTime('');
        setSemesterId(null);
    };

    const searchModeOptions = ['Mã lớp', 'Mã HP', 'Tên HP'];
    const departmentOptions = Object.keys(majorMapping);
    const majorOptions = department ? majorMapping[department] ?? [] : [];

    return {
        isProfileOpen,
        toggleProfile,
        handleLogout,
        handleUpload,
        searchQuery,
        setSearchQuery,
        searchMode,
        setSearchMode,
        department,
        setDepartment,
        major,
        setMajor,
        handleSearch,
        classesData,
        handleEdit,
        handleDelete,
        isModeModalOpen,
        setModeModalOpen,
        isDeptModalOpen,
        setDeptModalOpen,
        isMajorModalOpen,
        setMajorModalOpen,
        searchModeOptions,
        departmentOptions,
        majorOptions,
        handleSelectDepartment,
        // Expose phase states & methods
        phases,
        phaseType,
        setPhaseType,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        semesterId,
        setSemesterId,
        semestersList,
        isSemesterModalOpen,
        setSemesterModalOpen,
        editingPhaseId,
        handleSavePhase,
        handleEditPhase,
        handleDeletePhase,
        handleCancelEdit
    };
};
