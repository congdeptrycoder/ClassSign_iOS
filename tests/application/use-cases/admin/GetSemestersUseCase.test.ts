import { GetSemestersUseCase } from '../../../../src/application/use-cases/GetSemestersUseCase';
import { ISemesterRepository } from '../../../../src/domain/repositories/ISemesterRepository';
import { Semester } from '../../../../src/domain/entities/Semester';

describe('GetSemestersUseCase', () => {
    let useCase: GetSemestersUseCase;
    let mockSemesterRepository: jest.Mocked<ISemesterRepository>;

    beforeEach(() => {
        mockSemesterRepository = {
            createSemester: jest.fn(),
            getSemesters: jest.fn(),
        };
        useCase = new GetSemestersUseCase(mockSemesterRepository);
    });

    it('should call getSemesters on the repository and return results', async () => {
        const mockResult = [{ id: 1, semester: 20241 }] as Semester[];
        mockSemesterRepository.getSemesters.mockResolvedValue(mockResult);

        const result = await useCase.execute();
        expect(mockSemesterRepository.getSemesters).toHaveBeenCalled();
        expect(result).toEqual(mockResult);
    });

    it('should throw an error if repository throws', async () => {
        const mockError = new Error('Repository error');
        mockSemesterRepository.getSemesters.mockRejectedValue(mockError);

        await expect(useCase.execute()).rejects.toThrow('Repository error');
    });
});
