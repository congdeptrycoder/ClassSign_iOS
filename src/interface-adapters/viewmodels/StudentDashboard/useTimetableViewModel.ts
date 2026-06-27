import { useState, useEffect, useCallback } from 'react';
import { timetableController, appEventBus } from '../../../di/student.di';
import { logMessage } from '../../../shared/utils/logger';
import { parseTimetableEvents, TimeEvent } from '../../../shared/utils/timetableUtils';
import { TimetableEntry } from '../../../domain/entities/StudentRegistration';

const EVENTS = { TIMETABLE_CHANGED: 'TIMETABLE_CHANGED', CLASS_SLOTS_CHANGED: 'CLASS_SLOTS_CHANGED' } as const;

export const useTimetableViewModel = (studentId: number) => {
    const [registeredClasses, setRegisteredClasses] = useState<TimetableEntry[]>([]);
    const [timeGridEvents, setTimeGridEvents] = useState<TimeEvent[]>([]);

    const reloadTimetable = useCallback(async () => {
        try {
            const timetable = await timetableController.getTimetable(studentId);
            setRegisteredClasses(timetable);
            setTimeGridEvents(parseTimetableEvents(timetable));
        } catch (error) {
            logMessage('ERROR', 'Không thể tải thời khóa biểu', error);
        }
    }, [studentId]);

    useEffect(() => {
        reloadTimetable();

        const handleTimetableChanged = () => {
            reloadTimetable();
        };

        appEventBus.on('TIMETABLE_CHANGED', handleTimetableChanged);
        appEventBus.on('CLASS_SLOTS_CHANGED', handleTimetableChanged);

        return () => {
            appEventBus.off('TIMETABLE_CHANGED', handleTimetableChanged);
            appEventBus.off('CLASS_SLOTS_CHANGED', handleTimetableChanged);
        };
    }, [reloadTimetable]);

    return {
        registeredClasses,
        timeGridEvents,
    };
};
