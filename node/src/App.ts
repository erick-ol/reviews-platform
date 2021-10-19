import 'dotenv/config';
import Express from 'express';

import { router } from './routes';

const App = Express();

App.use(Express.json());
App.use(router);

App.get('/github', (request, response) => {
  response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

App.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

App.listen(4000, () => console.log(`Server is running on PORT 4000`));
