# Технологии

- Включенные в [шаблон](https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript):
  - фреймворк для серверного рендеринга [React](https://reactjs.org/) приложений [Next.js](https://nextjs.org/);
  - библиотеку компонентов _React_ - [material UI v5](https://mui.com/);
  - CSS-in-JS движок [emotion](https://emotion.sh/docs/introduction) с библиотекой компонентов [MUI](https://mui.com/);
  - язык [typescript](https://www.typescriptlang.org/).
- дополнительно:
  - менеджер состояния проекта [Redux](https://redux.js.org/) + [toolkit](https://redux-toolkit.js.org/) с обёрткой [
    next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper#redux-toolkit);
  - автоматизированная проверка кода:
    - [prettier](https://prettier.io/);
    - [stylelint](https://stylelint.io/). Замечание: проект использует stylelint версии < _14.0.0_ - для правильной работы в VS Code следует установить [расширение](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) версии не более _v0.87.6_;
    - [eslint](https://eslint.org/);
    - [axe](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/react/README.md);
    - [lint-staged](https://github.com/okonet/lint-staged).
  - тестирование и документирование:
    - [storybook](https://storybook.js.org/);
    - [testing-library](https://testing-library.com/):
      - [jest](https://jestjs.io/);
      - [react](https://testing-library.com/docs/react-testing-library/intro), [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom), [user-event](https://testing-library.com/docs/user-event/intro);
    - [chromatic](https://www.chromatic.com/docs/)
  - вспомогательные библиотеки:
    - [lodash](https://lodash.com/);
    - [use-gesture](https://github.com/pmndrs/use-gesture).
