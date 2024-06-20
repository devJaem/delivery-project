import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ENV } from './constants/env.constant.js';
import { globalErrorHandler } from './middlewares/error-handling.middleware.js';
import { requestLogger } from './middlewares/log.middleware.js';
import router from './routers/index.js';
import path from 'path';
import cors from 'cors';

const __dirname = path.resolve();
const app = express();
const PORT = ENV.PORT;
const server = http.createServer(app);
const io = new Server(server);

// socket.io에서 namespace 설정
const order = io.of('/order');

app.use(cors());
app.use((req, res, next) => {
  req.io = { order }; // io 객체를 req 객체에 추가하여 라우터에서 사용할 수 있도록 함
  next();
});
app.use(requestLogger);
app.use(express.json());
app.use('/', [router]);
app.use(globalErrorHandler);

app.get('/health-check', async (req, res) => {
  res.status(200).json({ message: '서버 정상 동작중' });
});

// 정적 파일을 서빙하기 위한 설정
app.use('/static', express.static(path.join(__dirname, 'public')));
// 클라이언트가 소켓 서버에 연결될 때
order.on('connection', (socket) => {
  console.log('A user connected');

  // 클라이언트 연결 해제 시
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
