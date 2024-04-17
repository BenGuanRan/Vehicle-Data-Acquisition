import TestObject, { ITestObjectModel } from '../model/TestObject.model'

class TestObjectService {
    // 创建测试对象
    async createTestObject(param: ITestObjectModel): Promise<TestObject | null> {
        try {
            const testObject = TestObject.create(param)
            return testObject
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
export default new TestObjectService