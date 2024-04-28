import ExcelJs from 'exceljs'
import { writeCollectorConfig, writeControllerConfig, writeSignalConfig } from './turnTestProcessConfigIntoExcel'
import SignalService from '../app/service/SignalService'
import ControllerService from '../app/service/ControllerService'
import CollectorService from '../app/service/CollectorService'
import { COLLECTOR_WORKSHEET, CONTROLLER_WORKSHEET, SIGNAL_WORKSHEET } from '../app/constants'


export async function getPreTestProcessConfigTempBuffer(assetsPath: string) {
    const workboot = new ExcelJs.Workbook()
    await writeControllerConfig(workboot, assetsPath)
    await writeCollectorConfig(workboot, assetsPath)
    await writeSignalConfig(workboot, assetsPath)
    beautifyWorkboot(workboot)
    return await workboot.xlsx.writeBuffer()
}
export async function getPreTestProcessConfigBuffer() {
    const workboot = new ExcelJs.Workbook()
    const controllersConfig = await ControllerService.getcontrollersConfig();
    const collectorsConfig = await CollectorService.getcollectorsConfig();
    const signalsConfig = await SignalService.getsignalsConfig();
    const controllerConfigWorkSheet = workboot.addWorksheet(CONTROLLER_WORKSHEET)
    controllerConfigWorkSheet.columns = [
        { header: '核心板卡代号', key: 'controllerName' },
        { header: '核心板卡地址', key: 'controllerAddress' }
    ]
    controllerConfigWorkSheet.addRows(controllersConfig)
    const collectorConfigWorkSheet = workboot.addWorksheet(COLLECTOR_WORKSHEET)
    collectorConfigWorkSheet.columns = [
        { header: '采集板卡代号', key: 'collectorName' },
        { header: '采集板卡地址', key: 'collectorAddress' }
    ]
    collectorConfigWorkSheet.addRows(collectorsConfig)
    const signalConfigWorkSheet = workboot.addWorksheet(SIGNAL_WORKSHEET)
    signalConfigWorkSheet.columns = [
        { header: '卡内序号', key: 'innerIndex' },
        { header: '采集板代号', key: 'collectorName' },
        { header: '信号名', key: 'signalName' },
        { header: '单位', key: 'signalUnit' },
        { header: '信号类型', key: 'signalType' },
        { header: '备注', key: 'remark' },
    ]
    signalConfigWorkSheet.addRows(signalsConfig)
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