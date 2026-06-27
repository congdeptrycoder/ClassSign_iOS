import { CancelClassRegistrationUseCase } from '../../../../src/application/use-cases/CancelClassRegistrationUseCase';
import { IClassRegistrationRepository } from '../../../../src/domain/repositories/IClassRegistrationRepository';

describe('CancelClassRegistrationUseCase', () => {
    let useCase: CancelClassRegistrationUseCase;
    let mockRepository: jest.Mocked<IClassRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            searchClassSuggestions: jest.fn(),
            registerClass: jest.fn(),
            getCourseClasses: jest.fn(),
            cancelClassRegistration: jest.fn(),
        };
        useCase = new CancelClassRegistrationUseCase(mockRepository);
    });

    it('should call cancelClassRegistration on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockClassId = 101;
        mockRepository.cancelClassRegistration.mockResolvedValue();

        await useCase.execute(mockStudentId, mockClassId);

        expect(mockRepository.cancelClassRegistration).toHaveBeenCalledWith(mockStudentId, mockClassId);
    });
});
