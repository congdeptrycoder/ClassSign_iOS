import { RegistrationPhaseController } from '../../../src/interface-adapters/controllers/RegistrationPhaseController';
import { GetRegistrationPhasesUseCase } from '../../../src/application/use-cases/GetRegistrationPhasesUseCase';
import { AddRegistrationPhaseUseCase } from '../../../src/application/use-cases/AddRegistrationPhaseUseCase';
import { UpdateRegistrationPhaseUseCase } from '../../../src/application/use-cases/UpdateRegistrationPhaseUseCase';
import { DeleteRegistrationPhaseUseCase } from '../../../src/application/use-cases/DeleteRegistrationPhaseUseCase';

describe('RegistrationPhaseController', () => {
    let controller: RegistrationPhaseController;
    let mockGet: jest.Mocked<GetRegistrationPhasesUseCase>;
    let mockAdd: jest.Mocked<AddRegistrationPhaseUseCase>;
    let mockUpdate: jest.Mocked<UpdateRegistrationPhaseUseCase>;
    let mockDelete: jest.Mocked<DeleteRegistrationPhaseUseCase>;

    beforeEach(() => {
        mockGet = { execute: jest.fn() } as any;
        mockAdd = { execute: jest.fn() } as any;
        mockUpdate = { execute: jest.fn() } as any;
        mockDelete = { execute: jest.fn() } as any;

        controller = new RegistrationPhaseController(mockGet, mockAdd, mockUpdate, mockDelete);
    });

    it('should get phases', async () => {
        const mockPhases = [{ id: '1', name: 'Phase 1' }] as any;
        mockGet.execute.mockResolvedValue(mockPhases);
        const result = await controller.getPhases();
        expect(mockGet.execute).toHaveBeenCalled();
        expect(result).toEqual(mockPhases);
    });

    it('should add phase', async () => {
        const mockPhase = { name: 'Phase 1' } as any;
        const mockResult = { id: '1', ...mockPhase };
        mockAdd.execute.mockResolvedValue(mockResult);
        const result = await controller.addPhase(mockPhase);
        expect(mockAdd.execute).toHaveBeenCalledWith(mockPhase);
        expect(result).toEqual(mockResult);
    });

    it('should update phase', async () => {
        const mockPhase = { id: '1', name: 'Phase 1 Updated' } as any;
        await controller.updatePhase(mockPhase);
        expect(mockUpdate.execute).toHaveBeenCalledWith(mockPhase);
    });

    it('should delete phase', async () => {
        const mockId = '1';
        await controller.deletePhase(mockId);
        expect(mockDelete.execute).toHaveBeenCalledWith(mockId);
    });
});
