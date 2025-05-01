import { CategoryNamePipe } from './category-name.pipe';

describe('CategoryNamePipe', () => {
  it('create an instance', () => {
    const mockCategoryService = jasmine.createSpyObj('CategoryService', ['methodName']); // Replace 'methodName' with actual methods if needed
    const pipe = new CategoryNamePipe(mockCategoryService);
    expect(pipe).toBeTruthy();
  });
});
