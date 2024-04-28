import { turnTestProcessConfigIntoExcel } from "./utils/turnTestProcessConfigIntoExcel"

(async () => {
    await turnTestProcessConfigIntoExcel(
        {
            "testName": "机动测试001",
            "testObjects": [
                {
                    "objectName": "04A履带式步兵战车",
                    "collectorSignals": [
                        {
                            "collectorSignalName": "战车所在纬度",
                            "controllerInfo": {
                                "controllerName": "hx-04A-1",
                      
                      
                      
                      
                                "controllerAddress": "192.168.0.101"
                            },
                            "collectorInfo": {
                                "collectorName": "hx-04A-1",
                                "collectorAddress": "192.168.0.101"
                            },
                            "signalInfo": {
                                "signalName": "纬度",
                                "signalUnit": "°",
                                "signalType": "北斗",
                                "remark": "北斗信息",
                                "innerIndex": 2
                            }
                        },
                        {
                            "collectorSignalName": "战车所在经度",
                            "controllerInfo": {
                                "controllerName": "hx-04A-1",
                                "controllerAddress": "192.168.0.101"
                            },
                            "collectorInfo": {
                                "collectorName": "hx-04A-1",
                                "collectorAddress": "192.168.0.101"
                            },
                            "signalInfo": {
                                "signalName": "经度",
                                "signalUnit": "°",
                                "signalType": "北斗",
                                "remark": "北斗信息",
                                "innerIndex": 1
                            }
                        },
                        {
                            "collectorSignalName": "行驶总里程",
                            "controllerInfo": {
                                "controllerName": "hx-04A-1",
                                "controllerAddress": "192.168.0.101"
                            },
                            "collectorInfo": {
                                "collectorName": "zx-04A-1",
                                "collectorAddress": "1"
                            },
                            "signalInfo": {
                                "signalName": "总里程",
                                "signalUnit": "km",
                                "signalType": "FlexRay",
                                "remark": null,
                                "innerIndex": 2
                            }
                        }
                    ]
                },
                {
                    "objectName": "96式战车",
                    "collectorSignals": [
                        {
                            "collectorSignalName": "战车所在纬度",
                            "controllerInfo": {
                                "controllerName": "hx-96-1",
                                "controllerAddress": "192.168.0.102"
                            },
                            "collectorInfo": {
                                "collectorName": "hx-96-1",
                                "collectorAddress": "192.168.0.102"
                            },
                            "signalInfo": {
                                "signalName": "纬度",
                                "signalUnit": "°",
                                "signalType": "北斗",
                                "remark": "北斗信息",
                                "innerIndex": 4
                            }
                        },
                        {
                            "collectorSignalName": "战车所在经度",
                            "controllerInfo": {
                                "controllerName": "hx-96-1",
                                "controllerAddress": "192.168.0.102"
                            },
                            "collectorInfo": {
                                "collectorName": "hx-96-1",
                                "collectorAddress": "192.168.0.102"
                            },
                            "signalInfo": {
                                "signalName": "经度",
                                "signalUnit": "°",
                                "signalType": "北斗",
                                "remark": "北斗信息",
                                "innerIndex": 3
                            }
                        },
                        {
                            "collectorSignalName": "行驶总里程",
                            "controllerInfo": {
                                "controllerName": "hx-96-1",
                                "controllerAddress": "192.168.0.102"
                            },
                            "collectorInfo": {
                                "collectorName": "zx-96-1",
                                "collectorAddress": "2"
                            },
                            "signalInfo": {
                                "signalName": "总里程",
                                "signalUnit": "km",
                                "signalType": "FlexRay",
                                "remark": null,
                                "innerIndex": 33
                            }
                        }
                    ]
                }
            ]
        }
    )
})()