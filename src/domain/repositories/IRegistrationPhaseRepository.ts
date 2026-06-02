import { RegistrationPhase } from '../entities/RegistrationPhase';

export interface IRegistrationPhaseRepository {
  getPhases(): RegistrationPhase[];
  addPhase(phase: Omit<RegistrationPhase, 'id'>): RegistrationPhase;
  updatePhase(phase: RegistrationPhase): void;
  deletePhase(id: string): void;
  getActivePhase(currentTime?: Date): RegistrationPhase | null;
  subscribe(callback: (phases: RegistrationPhase[]) => void): () => void;
}
