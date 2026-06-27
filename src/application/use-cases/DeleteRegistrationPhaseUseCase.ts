import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class DeleteRegistrationPhaseUseCase {
  constructor(private phaseRepository: IRegistrationPhaseRepository) {}

  public async execute(id: string): Promise<void> {
    await this.phaseRepository.deletePhase(id);
  }
}
