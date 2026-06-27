import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class GetRegistrationPhasesUseCase {
  constructor(private phaseRepository: IRegistrationPhaseRepository) {}

  public async execute(): Promise<RegistrationPhase[]> {
    return await this.phaseRepository.getPhases();
  }
}
