import { RegistrationPhase } from '../entities/RegistrationPhase';

export interface IRegistrationPhaseRepository {
  getPhases(): Promise<RegistrationPhase[]>;
  addPhase(phase: Omit<RegistrationPhase, 'id' | 'isActive' | 'semesterName'>): Promise<RegistrationPhase>;
  updatePhase(phase: RegistrationPhase): Promise<void>;
  deletePhase(id: string): Promise<void>;
  subscribe(callback: (phases: RegistrationPhase[]) => void): () => void;
}
