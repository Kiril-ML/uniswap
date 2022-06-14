import { rest } from 'msw';

const handlers = [
  rest.post('https://api.trello.com/1/boards', (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.get('https://api.trello.com/1/members/me', (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];

export { handlers };
