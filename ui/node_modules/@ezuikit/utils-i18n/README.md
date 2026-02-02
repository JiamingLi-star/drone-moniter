## I18n

多语言

## scripts

```bash
pnpm run dev

pnpm run build
```

## 使用

```bash
pnpm install @ezuikit/utils-i18n

```

```ts
import I18n from '@ezuikit/utils-i18n';
import zh from './locales/zh_CN';
import en from './locales/en_US';

const i18n = new I18n(
  {
    zh,
    en,
  },
  {
    locale: 'zh',
    defaultLocale: 'zh',
    enableFallback: true,
  },
);

i18n.t('title');

// name 是一个占位符
i18n.t('name', { name: 'ShineShao' }); // {name: "name: {{name}}"} =>  {name: "name: ShineShao"}
```
