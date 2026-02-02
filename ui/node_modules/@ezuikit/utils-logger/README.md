## Logger

日志工具类

## scripts

```bash

# http://localhost:3000
pnpm run dev

pnpm run build

```

## 使用

```bash
pnpm install @ezuikit/utils-logger

```

```ts
export interface LoggerOptions {
  level?: 'INFO' | 'LOG' | 'WARN' | 'ERROR';
  showTime?: boolean;
  name?: string;
}
```

```ts
import Logger from '@ezuikit/utils-logger';

const logger = new Logger({ level: 'INFO' });

logger.info('info');
logger.log('log');
logger.warn('warn');
logger.error('error');

// 更改日志等级 WARN 只打印 warn error
logger.setOptions({ level: 'WARN' });

logger.info('setOptions info');
logger.log('setOptions log');
logger.warn('setOptions warn');
logger.error('setOptions error');
```
