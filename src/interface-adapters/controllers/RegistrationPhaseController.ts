import { AddRegistrationPhaseUseCase } from '../../application/use-cases/AddRegistrationPhaseUseCase';
import { DeleteRegistrationPhaseUseCase } from '../../application/use-cases/DeleteRegistrationPhaseUseCase';
import { GetRegistrationPhasesUseCase } from '../../application/use-cases/GetRegistrationPhasesUseCase';
import { UpdateRegistrationPhaseUseCase } from '../../application/use-cases/UpdateRegistrationPhaseUseCase';
import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';

export class RegistrationPhaseController {
  constructor(
    private readonly getRegistrationPhasesUseCase: GetRegistrationPhasesUseCase,
    private readonly addRegistrationPhaseUseCase: AddRegistrationPhaseUseCase,
    private readonly updateRegistrationPhaseUseCase: UpdateRegistrationPhaseUseCase,
    private readonly deleteRegistrationPhaseUseCase: DeleteRegistrationPhaseUseCase
  ) {}

  public async getPhases(): Promise<RegistrationPhase[]> {
    return this.getRegistrationPhasesUseCase.execute();
  }

  public async addPhase(phase: Omit<RegistrationPhase, 'id' | 'isActive' | 'semesterName'>): Promise<RegistrationPhase> {
    return this.addRegistrationPhaseUseCase.execute(phase);
  }

  public async updatePhase(phase: RegistrationPhase): Promise<void> {
    return this.updateRegistrationPhaseUseCase.execute(phase);
  }

  public async deletePhase(id: string): Promise<void> {
    return this.deleteRegistrationPhaseUseCase.execute(id);
  }
}
