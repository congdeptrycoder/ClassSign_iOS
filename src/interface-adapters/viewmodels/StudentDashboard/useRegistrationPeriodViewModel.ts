import { useEffect, useState } from 'react';
import { GetActiveRegistrationPhase } from '../../../application/use-cases/GetActiveRegistrationPhase';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import { registrationPhaseRepository } from '../../../di/student.di';

export const useRegistrationPeriodViewModel = () => {
    const [activePhase, setActivePhase] = useState<RegistrationPhase | null>(null);

    useEffect(() => {
        const getActivePhaseUseCase = new GetActiveRegistrationPhase();
        const unsubscribe = registrationPhaseRepository.subscribe(phases => {
            setActivePhase(getActivePhaseUseCase.execute(phases));
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return {
        activePhase,
    };
};
