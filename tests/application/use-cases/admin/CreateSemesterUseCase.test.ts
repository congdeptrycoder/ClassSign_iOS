import { CreateSemesterUseCase } from '../../../../src/application/use-cases/CreateSemesterUseCase';
import { ISemesterRepository } from '../../../../src/domain/repositories/ISemesterRepository';

describe('CreateSemesterUseCase', () => {
    let useCase: CreateSemesterUseCase;
    let mockSemesterRepository: jest.Mocked<ISemesterRepository>;

    beforeEach(() => {
        mockSemesterRepository = {
            createSemester: jest.fn(),
            getSemesters: jest.fn(),
        };
        useCase = new CreateSemesterUseCase(mockSemesterRepository);
    });

    it('should call createSemester on the repository with correct data', async () => {
        const mockSemesterCode = '20241';
        await useCase.execute(mockSemesterCode);
        expect(mockSemesterRepository.createSemester).toHaveBeenCalledWith(mockSemesterCode);
        expect(mockSemesterRepository.createSemester).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if repository throws', async () => {
        const mockSemesterCode = '20241';
        const mockError = new Error('Repository error');
        mockSemesterRepository.createSemester.mockRejectedValue(mockError);

        await expect(useCase.execute(mockSemesterCode)).rejects.toThrow('Repository error');
    });
});
