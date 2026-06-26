import { Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import { RegistrationPhaseRepositoryImpl } from '../../../infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { ManageRegistrationPhases } from '../../../application/use-cases/ManageRegistrationPhases';
import { logMessage } from '../../../shared/utils/logger';
import { apiClient } from '../../../infrastructure/api/apiClient';
import { FilterTableByColumn } from '../../../shared/utils/FilterTableByColumn';

// Khởi tạo ngoài hook để tránh tạo lại mỗi lần render (tránh race condition)
const phaseRepository = RegistrationPhaseRepositoryImpl.getInstance();
const managePhasesUseCase = new ManageRegistrationPhases(phaseRepository);

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
    thu: string;
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



export const useAdminDashboardViewModel = (
    onNavigateToEdit?: (item: ClassInfo) => void,
    onLogout?: () => void,
    isVisible: boolean = true,
) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // State cho tìm kiếm theo cột
    const [filters, setFilters] = useState<Partial<Record<keyof ClassInfo, string>>>({});
    const [classesData, setClassesData] = useState<ClassInfo[]>([]);

    // ── Giai đoạn đăng ký (Phases) states ────────────────────────────────────
    const [phases, setPhases] = useState<RegistrationPhase[]>([]);
    const [phaseType, setPhaseType] = useState<'course' | 'class'>('course');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [semesterId, setSemesterId] = useState<number | null>(null);
    const [semestersList, setSemestersList] = useState<SemesterInfo[]>([]);
    const [isSemesterModalOpen, setSemesterModalOpen] = useState(false);

    // State cho dropdown chọn học kỳ của bảng lớp học
    const [selectedClassSemesterId, setSelectedClassSemesterId] = useState<number | null>(null);
    const [isClassSemesterModalOpen, setClassSemesterModalOpen] = useState(false);
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

    const [isCreateSemesterModalOpen, setCreateSemesterModalOpen] = useState(false);
    const [newSemesterCode, setNewSemesterCode] = useState('');

    const fetchSemesters = async () => {
        try {
            const semesters = await apiClient.get<SemesterInfo[]>('/semesters');
            setSemestersList(semesters);
            if (semesters.length > 0) {
                const maxId = Math.max(...semesters.map(s => s.id));
                setSelectedClassSemesterId(maxId);
            }
        } catch (error) {
            logMessage('ERROR', 'Failed to fetch semesters', error);
            setSemestersList([]);
        }
    };

    useEffect(() => {
        fetchSemesters();

        const unsubscribe = phaseRepository.subscribe(updatedPhases => {
            setPhases(updatedPhases);
        });
        return () => {
            unsubscribe();
        };
    }, []); // Chỉ chạy 1 lần khi mount vì phaseRepository là singleton bên ngoài hook

    const handleCreateSemester = async () => {
        if (!newSemesterCode || newSemesterCode.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập mã kỳ');
            return;
        }
        try {
            await apiClient.post('/semesters', { semester: newSemesterCode.trim() });
            Alert.alert('Thành công', 'Thêm kỳ mới thành công');
            setCreateSemesterModalOpen(false);
            setNewSemesterCode('');
            await fetchSemesters(); // Refresh list
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Lỗi thêm kỳ';
            Alert.alert('Lỗi', msg);
        }
    };

    // Fetch lớp học khi đổi selectedClassSemesterId
    const fetchClasses = async (semId: number) => {
        try {
            const data = await apiClient.get<ClassInfo[]>(`/admin/classes/all?semester=${semId}`);
            setClassesData(data);
        } catch (error) {
            logMessage('ERROR', 'Failed to fetch classes data', error);
            setClassesData([]);
        }
    };

    useEffect(() => {
        if (!selectedClassSemesterId) return;
        fetchClasses(selectedClassSemesterId);
    }, [selectedClassSemesterId]);

    // Refetch data khi màn hình trở lại visible (sau khi edit/create)
    const prevVisibleRef = useRef(isVisible);
    useEffect(() => {
        if (isVisible && !prevVisibleRef.current && selectedClassSemesterId) {
            logMessage('INFO', 'AdminDashboard trở lại visible, refetch data');
            fetchClasses(selectedClassSemesterId);
        }
        prevVisibleRef.current = isVisible;
    }, [isVisible]);

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

    const handleFilterChange = (key: keyof ClassInfo, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
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

    const filteredClasses = FilterTableByColumn(classesData, filters);

    return {
        isProfileOpen,
        toggleProfile,
        handleLogout,
        handleUpload,
        filters,
        handleFilterChange,
        classesData: filteredClasses,
        handleEdit,
        handleDelete,
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
        selectedClassSemesterId,
        setSelectedClassSemesterId,
        isClassSemesterModalOpen,
        setClassSemesterModalOpen,
        editingPhaseId,
        handleSavePhase,
        handleEditPhase,
        handleDeletePhase,
        handleCancelEdit,
        isCreateSemesterModalOpen,
        setCreateSemesterModalOpen,
        newSemesterCode,
        setNewSemesterCode,
        handleCreateSemester
    };
};
