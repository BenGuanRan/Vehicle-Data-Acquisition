import ExcelJs from 'exceljs'
import { writeCollectorConfig, writeControllerConfig, writeSignalConfig } from './turnTestProcessConfigIntoExcel'


export async function getPreTestProcessConfigBuffer(assetsPath: string) {
    const workboot = new ExcelJs.Workbook()
    await writeControllerConfig(workboot, assetsPath)
    await writeCollectorConfig(workboot, assetsPath)
    await writeSignalConfig(workboot, assetsPath)
    beautifyWorkboot(workboot)
    return await workboot.xlsx.writeBuffer()
}

function beautifyWorkboot(workboot: ExcelJs.Workbook) {
    workboot.eachSheet((worksheet, id) => {
        // 修改标题样式
        worksheet.getRows(1, 1)!.forEach(row => {
            row.font = {
                bold: true
            }
        })
        // 修改所有单元格
        worksheet.eachRow(row => {
            row.eachCell(cell => {
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                }
            })
        })
        worksheet.eachColumnKey(col => {
            col.width = (col.header?.length || 0) * 2 + 10
            col.eachCell!(cell => {
                cell.numFmt = '0.00'
            })
        })
    })
}