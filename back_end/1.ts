import path from "path";
import { excelReader } from "./utils/excelReader";


; (async () => {
    const a = await excelReader({
        path: path.join(__dirname, './assets/测试配置.xlsx'),
        workSheetName: '采集板卡描述',
        keys: ['name', 'addr']
    })
    console.log(a);

})()