import { RemoveFieldsInterceptor } from './remove-fields.interceptor';

describe('RemoveFieldsInterceptor', () => {
  let target: RemoveFieldsInterceptor<any>;

  describe('constructor', () => {
    it('should be defined', () => {
      //? ARRANGE

      //? ACT
      target = new RemoveFieldsInterceptor([]);

      //? ASSERT
      expect(target).toBeDefined();
    });
  });
});
