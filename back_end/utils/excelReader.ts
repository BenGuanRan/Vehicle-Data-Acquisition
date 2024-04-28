import * as xlsx from 'node-xlsx';
import * as fs from 'fs';

export async function excelReader({ path, workSheetName, keys }: {
    path: string
    workSheetName: string
    keys: string[]
}): Promise<Object[] | null> {
    return new Promise((resolve, reject) => {
        // 读取 Excel 文件的路径
        // const excelFilePath = path.join(__dirname, '../assets/测试配置.xlsx');

        // 读取 Excel 文件
        const workSheetsFromFile = xlsx.parse(fs.readFileSync(path));

        const workSheet = workSheetsFromFile.filter(ws => ws.name === workSheetName)[0]
        if (!workSheet) reject(null)
        // 遍历工作表
        const data: Object[] = []
        workSheet.data.forEach((row, index) => {
            if (index !== 0) {
                const obj: { [key: string]: string } = {}
                row.forEach((val, i) => {
                    obj[keys[i]] = val || '-'
                })
                data.push(obj)
            }
        });
        resolve(data)
    })

}

