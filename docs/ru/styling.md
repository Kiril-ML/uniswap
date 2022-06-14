# Styling

- [Что в проекте](#что-в-проекте);
- [что следует использовать](#что-следует-использовать);
- [пример](#пример);
- [дополнительные инструменты](#дополнительные-инструменты).

## Что в проекте

- способы стилизации:
  - [импорт css файлов](https://nextjs.org/docs/basic-features/built-in-css-support#adding-a-global-stylesheet), но помни о [порядке вставки CSS когда используешь material UI](https://next.material-ui.com/guides/interoperability/#css-injection-order);
  - [CSS модули](https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css), но помни о [порядке вставки CSS когда используешь material UI](https://next.material-ui.com/guides/interoperability/#css-modules);
  - CSS-in-JS решение: [документация nextJS](https://nextjs.org/docs/basic-features/built-in-css-support#css-in-js), [emotion с material UI](https://next.material-ui.com/guides/interoperability/#emotion). P.S.: проект поддерживает [`sx` props](https://next.material-ui.com/system/basics/#why-use-the-system), но использовать его не стоит.
- дополнительные включения:
  - автоматизация:
    - [глобальный CSS](/src/pages/_app.css);
    - [normalize.css](https://github.com/csstools/postcss-normalize);
    - [CSSBaseline](https://next.material-ui.com/components/css-baseline/).
  - самостоятельное использование:
    - [material icons](https://mui.com/components/icons/#material-icons).

## Что следует использовать

- [emotion/react](https://emotion.sh/docs/@emotion/react) как основной инструмент(используй из `'@mui/material'`), подробнее: [emotion css prop](https://emotion.sh/docs/css-prop), [композиция](https://emotion.sh/docs/composition), [вложенность](https://emotion.sh/docs/nested), [media](https://emotion.sh/docs/media-queries), [темизация](https://emotion.sh/docs/theming). Так же не рекомендуется использовать [object styles](https://emotion.sh/docs/object-styles) и [styled components](https://emotion.sh/docs/styled) по причине плохой поддержки линтинга и трудно читаемости;
- [material UI](https://mui.com/ru/guides/interoperability/#emotion) как основной фреймворк, подробнее: [material дизайн](https://material.io/design/environment/surfaces.html#properties);
- [storybook](https://storybook.js.org/) для создания, тестирования и документирования UI.

Главная причина использования CSS-in-JS: `props` react компонента могут быть использованы напрямую и динамически - не надо создавать +100500 [модификаторов](https://ru.bem.info/methodology/block-modification/) под каждое уникальное значение.

## Пример

### Базовый пример

Файл `Button.style.ts`

```ts
import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

import type { Props } from './Button';

const createStyles = (
  // общие пропсы
  props: Pick<Props, 'isPrimary' | 'size' | 'backgroundColor'>,
  theme: Theme
) => ({
  /*
   * Это корневой элемент компонента, у него должно быть всегда имя root.
   */
  root: () => {
    const isPrimary = props.isPrimary
      ? css`
          background-color: ${theme.palette.primary.main};
          color: ${theme.palette.primary.contrastText};
        `
      : css`
          background-color: ${theme.palette.secondary.main};
          color: ${theme.palette.secondary.contrastText};
        `;
    const backgroundColor =
      props.backgroundColor &&
      css`
        background-color: ${props.backgroundColor};
      `;

    let size;

    switch (props.size) {
      case 'small': {
        size = css`
          padding: ${theme.spacing(0.5, 1)};
          font-size: ${theme.typography.pxToRem(12)};
        `;

        break;
      }
      case 'medium': {
        size = css`
          padding: ${theme.spacing(1, 2)};
          font-size: ${theme.typography.pxToRem(14)};
        `;

        break;
      }
      case 'large': {
        size = css`
          padding: ${theme.spacing(1.5, 3)};
          font-size: ${theme.typography.pxToRem(16)};
        `;

        break;
      }
      default: {
        size = '';
      }
    }

    return css`
      display: inline-block;
      border: 0;
      font-weight: ${theme.typography.button.fontWeight};
      font-family: ${theme.typography.button.fontFamily};
      line-height: ${theme.typography.button.lineHeight};

      ${isPrimary}
      ${size}
      ${backgroundColor}
    `;
  },
});

export { createStyles };
```

Файл `Button.tsx`

```tsx
import { FC, CSSProperties } from 'react';
import { useTheme } from '@mui/material';

import { createStyles } from './Button.style';

type Props = {
  /**
   * Контент кнопки
   */
  label: string;

  /**
   * Является ли это основным призывом к действию на странице?
   */
  isPrimary?: boolean;

  /**
   * Насколько большой должна быть кнопка?
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Какой фон использовать
   */
  backgroundColor?: CSSProperties['backgroundColor'];

  /**
   * Опциональный обработчик клика
   */
  onClick?: () => void;
};

/**
 * Основной UI компонент для пользовательского взаимодействия
 */
const Button: FC<Props> = ({
  label,
  backgroundColor,
  isPrimary = false,
  size = 'medium',
  ...theRestProps
}) => {
  const theme = useTheme();
  const styles = createStyles({ isPrimary, size, backgroundColor }, theme);

  return (
    <button type="button" css={styles.root()} {...theRestProps}>
      {label}
    </button>
  );
};

export type { Props };

export { Button };
```

### Селекторы потомков

Мы не можем использовать [.name](https://github.com/emotion-js/emotion/issues/1217) и договорились не использовать [object style](https://emotion.sh/docs/object-styles#child-selectors), так же самостоятельное именование: [Material UI](https://next.material-ui.com/customization/how-to-customize/#overriding-nested-component-styles) или [BEM](https://github.com/albburtsev/bem-cn) избыточно так как имя класса генерируется автоматически на основании окружения. Так что если нужен селектор потомка есть 3 варианта:

- использовать [AMCSS трюк](https://amcss.github.io/) в паре с [label свойством](https://emotion.sh/docs/labels) `[class*="label-name"]{}`;
- передавать аргументы для элементов компонента из компонента в функцию стилизации элемента;
- задать селектор класса элементу компонента в разметке и использовать его для стилизации в файле стилей - такой подход желательно [использовать](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles) не более чем с MUI компонентами: способ менее удобен так как приходится менять больше файлов и поддерживать изолированность классов или использовать модульный css.

### Темизация

Модифицируй [файлы темы](/src/services/theme/modes) и используй `useTheme()` из `@mui/material` для доступа к теме из компонента(или `withTheme` HOC если ты уверен в использовании классового компонента), для подробностей читай [документацию](https://mui.com/customization/theming/).

## Дополнительные инструменты

- [создание темы](https://mui.com/customization/theming/#theme-builder);
- [шаблоны](https://mui.com/getting-started/templates/).
