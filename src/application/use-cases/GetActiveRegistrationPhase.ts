import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class GetActiveRegistrationPhase {
  constructor(private phaseRepository: IRegistrationPhaseRepository) {}

  public execute(currentTime?: Date): RegistrationPhase | null {
    return this.phaseRepository.getActivePhase(currentTime);
  }
}
