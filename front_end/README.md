# 车辆数据采集系统
## 技术选型
- React
- Typescript
- vite
- antd组件库
- echarts
## 合作规范
1. 所有编码均在src文件路径下
```txt
- src 源代码
  - views 存放页面，页面抽离的**单次使用**的子组件
  - components 存放组件，可能被多次引用的组件。
  - utils 存放工具函数
  - assets 存放引用的资源，例如图片、字体等
  - apis 文件存放用于网络通信的接口
  - mock 存放mock测试数据，生产环境中应当删除，且不影响项目正常运行
  - routes 路由配置信息
  - constants 存放一些必要的const常量
```
2. 一些常量应定义在constants文件夹中
3. ts减少使用any类型
4. 编写接口时应尽量进行接口的类型定义
5. git提交规范可详见：https://zhuanlan.zhihu.com/p/90281637