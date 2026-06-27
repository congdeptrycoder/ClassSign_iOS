import { RegisterClassUseCase } from '../../../../src/application/use-cases/RegisterClassUseCase';
import { IClassRegistrationRepository } from '../../../../src/domain/repositories/IClassRegistrationRepository';

describe('RegisterClassUseCase', () => {
    let useCase: RegisterClassUseCase;
    let mockRepository: jest.Mocked<IClassRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            searchClassSuggestions: jest.fn(),
            registerClass: jest.fn(),
            getCourseClasses: jest.fn(),
            cancelClassRegistration: jest.fn(),
        };
        useCase = new RegisterClassUseCase(mockRepository);
    });

    it('should call registerClass on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockClassId = 101;
        mockRepository.registerClass.mockResolvedValue();

        await useCase.execute(mockStudentId, mockClassId);

        expect(mockRepository.registerClass).toHaveBeenCalledWith(mockStudentId, mockClassId);
    });
});
