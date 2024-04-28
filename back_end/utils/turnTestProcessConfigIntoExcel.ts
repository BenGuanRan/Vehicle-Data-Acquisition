import ExcelJs from 'exceljs'
import { excelReader } from './excelReader'
import { COLLECTOR_WORKSHEET, CONTROLLER_WORKSHEET, DEVICE_CONFIG_FILE_NAME, SIGNAL_WORKSHEET } from '../app/constants'
import { ICollectorModel } from '../app/model/Collector.model'
import path from 'path'
import { IControllerModel } from '../app/model/Controller.model'
import { ISignalModel } from '../app/model/Signal.model'

export interface ITestProcessConfig {
    testName: string
    testObjects: {
        objectName: string
        collectorSignals: {
            collectorSignalName: string
            controllerInfo: {
                controllerName: string
                controllerAddress: string
            }
            collectorInfo: {
                collectorName: string
                collectorAddress: string
            }
            signalInfo: {
                signalName: string
                signalUnit: string | null
                signalType: string | null
                remark: string | null
                innerIndex: number
            }
        }[]
    }[]
}

export async function turnTestProcessConfigIntoExcel(config: ITestProcessConfig, assetsPath: string = path.join(__dirname, `../assets`)) {
    const { testName, testObjects } = config
    const workboot = new ExcelJs.Workbook()
    const worksheet = workboot.addWorksheet('测试配置')
    worksheet.columns = [
        { header: '测试编号', key: 'testName' },
        { header: '序号', key: 'index' },
        { header: '测试对象', key: 'objectName' },
        { header: '核心控制卡编号', key: 'controllerName' },
        { header: '核心卡地址', key: 'controllerAddress' },
        { header: '采集卡编号', key: 'collectorName' },
        { header: '采集卡地址', key: 'collectorAddress' },
        { header: '采集卡内序号', key: 'innerIndex' },
        { header: '数据采集项', key: 'signalName' },
        { header: '采集信号类型', key: 'signalType' },
        { header: '采集项单位', key: 'signalUnit' },
        { header: '采集项关联', key: 'collectorSignalName' },
        { header: '备注', key: 'remark' },
    ]
    const mergeA = [2]
    const mergeC: number[] = []

    const data: any[] = []
    let count = 0
    testObjects.forEach(({ objectName, collectorSignals }, index1) => {
        mergeC.push((mergeC[mergeC.length - 1] || 1) + 1)
        mergeC.push(mergeC[mergeC.length - 1] + collectorSignals.length - 1)
        collectorSignals.forEach(({
            collectorSignalName,
            controllerInfo: {
                controllerName,
                controllerAddress
            },
            collectorInfo: {
                collectorName,
                collectorAddress
            },
            signalInfo: {
                signalName,
                signalUnit,
                signalType,
                remark,
                innerIndex
            }
        }, index2) => {
            const row = {
                testName,
                index: String((index1 + 1) * (index2 + 1)),
                objectName: objectName || '-',
                controllerName: controllerName || '-',
                controllerAddress: controllerAddress || '-',
                collectorName: collectorName || '-',
                collectorAddress: collectorAddress || '-',
                innerIndex: innerIndex || '-',
                signalName: signalName || '-',
                signalType: signalType || '-',
                signalUnit: signalUnit || '-',
                collectorSignalName: collectorSignalName || '-',
                remark: remark || '-'
            }
            data.push(row)
            count++
        })
    })
    mergeA.push(count + 1)
    worksheet.addRows(data)

    // 合并测试编号和测试对象
    worksheet.mergeCells(`A${mergeA[0]}:A${mergeA[1]}`)
    for (let i = 0; i < mergeC.length; i += 2) {
        worksheet.mergeCells(`C${mergeC[i]}:C${mergeC[i + 1]}`)
    }

    await writeControllerConfig(workboot, assetsPath)
    await writeCollectorConfig(workboot, assetsPath)
    await writeSignalConfig(workboot, assetsPath)
    beautifyWorkboot(workboot)
    // await workboot.xlsx.writeFile(`${assetsPath}/${testName}_测试配置文件.xlsx`)
    return await workboot.xlsx.writeBuffer()
}

export async function writeCollectorConfig(workboot: ExcelJs.Workbook, assetsPath: string = path.join(__dirname, `../assets`)) {
    const collectorConfig = (await excelReader({
        path: `${assetsPath}/${DEVICE_CONFIG_FILE_NAME}`,
        workSheetName: COLLECTOR_WORKSHEET,
        keys: ['collectorName', 'collectorAddress']
    })) as ICollectorModel[]
    const collectorConfigWorkSheet = workboot.addWorksheet(COLLECTOR_WORKSHEET)
    collectorConfigWorkSheet.columns = [
        { header: '采集板卡代号', key: 'collectorName' },
        { header: '采集板卡地址', key: 'collectorAddress' }
    ]
    collectorConfigWorkSheet.addRows(collectorConfig)
}

export async function writeControllerConfig(workboot: ExcelJs.Workbook, assetsPath: string = path.join(__dirname, `../assets`)) {
    const controllerConfig = (await excelReader({
        path: `${assetsPath}/${DEVICE_CONFIG_FILE_NAME}`,
        workSheetName: CONTROLLER_WORKSHEET,
        keys: ['controllerName', 'controllerAddress']
    })) as IControllerModel[]
    const controllerConfigWorkSheet = workboot.addWorksheet(CONTROLLER_WORKSHEET)
    controllerConfigWorkSheet.columns = [
        { header: '核心板卡代号', key: 'controllerName' },
        { header: '核心板卡地址', key: 'controllerAddress' }
    ]
    controllerConfigWorkSheet.addRows(controllerConfig)
}

export async function writeSignalConfig(workboot: ExcelJs.Workbook, assetsPath: string = path.join(__dirname, `../assets`)) {
    const signalConfig = (await excelReader({
        path: `${assetsPath}/${DEVICE_CONFIG_FILE_NAME}`,
        workSheetName: SIGNAL_WORKSHEET,
        keys: ['innerIndex', 'collectorName', 'signalName', 'signalUnit', 'signalType', 'remark']
    })) as (ISignalModel & { collectorName?: string })[]
    const signalConfigWorkSheet = workboot.addWorksheet(SIGNAL_WORKSHEET)
    signalConfigWorkSheet.columns = [
        { header: '卡内序号', key: 'innerIndex' },
        { header: '采集板代号', key: 'collectorName' },
        { header: '信号名', key: 'signalName' },
        { header: '单位', key: 'signalUnit' },
        { header: '信号类型', key: 'signalType' },
        { header: '备注', key: 'remark' },
    ]
    signalConfigWorkSheet.addRows(signalConfig)
}

function beautifyWorkboot(workboot: ExcelJs.Workbook) {
    workboot.eachSheet((worksheet, id) => {
        if (id === 1) {
            worksheet.eachRow(row => {
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                })
            })
        }
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