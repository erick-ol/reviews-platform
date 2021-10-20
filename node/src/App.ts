import 'dotenv/config';
import Express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { router } from './routes';

const App = Express();
App.use(cors());

const serverHttp = http.createServer(App);
const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

io.on("connection", socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
})

App.use(Express.json());
App.use(router);

App.get('/github', (request, response) => {
  response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

App.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

export { serverHttp, io };
