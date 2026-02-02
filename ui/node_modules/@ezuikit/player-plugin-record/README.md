## @ezuikit/player-plugin-record

### 录制

### 录制视频插件

```js
import EZopenPlayer from "@ezuikit/player-ezopen";
import { PlayerPluginRecord } from "@ezuikit/player-plugin-record";

// 播放地址 url 和 accessToken 从下面地址获取
// https://open.ys7.com/console/device.html
const player = new EZopenPlayer({
  id: "app",
  url: "ezopne player url",
  accessToken: "accessToken",
  width: 600,
  height: 400,
});

const recordPlugin = new PlayerPluginRecord(); // 录制插件
// ezopen播放插件使用
player.use(recordPlugin);

// 开始录制
recordPlugin.startRecord();

// 停止录制
// recordPlugin.stopRecord()

// 销毁插件
// recordPlugin.destroy();
```
