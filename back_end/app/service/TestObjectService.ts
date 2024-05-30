import TestObject, { ITestObjectModel } from '../model/2TestObject.model'

class TestObjectService {
    // 创建测试对象
    async createTestObject(param: ITestObjectModel): Promise<TestObject | null> {
        try {
            const testObject = await TestObject.create(param)
            return testObject
        } catch (error) {
            console.log(error);
            return null
        }
    }
    // 通过testProcessId删除所有testObject
    async deleteTestObjectsByTestProcessId(testProcessId: number): Promise<boolean> {
        try {
            await TestObject.destroy({
                where: { testProcessId }
            })
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
}
export default new TestObjectService