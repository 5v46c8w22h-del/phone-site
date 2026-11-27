# D11 BLE Analyzer

独立 iOS BLE 分析工具，适用于连接精臣 D11 并查看 BLE 服务、特征值、通知及本工具自身发送/接收的数据。

## 功能
- 扫描附近 BLE 设备并连接
- 自动发现所有服务和特征值及其属性
- 订阅 Notify/Indicate、读取 Read 特征值
- 对选定 Write 特征值手动发送 HEX 数据
- 记录本工具自身的 TX、RX、系统回调和时间戳
- 导出 TXT 日志

## 重要限制
iOS CoreBluetooth 只能观察本 APP 自己建立的 BLE 会话。它不能截获精臣官方 APP 正在进行的蓝牙连接，也不是空中无线嗅探器。若要抓取官方 APP 的真实通信，需要外部 BLE sniffer 或其他受支持的抓包环境。

## 云端编译
将整个目录内容上传到一个独立 GitHub 仓库，Actions 会自动编译未签名 IPA。用 Sideloadly 安装到 iPhone。
