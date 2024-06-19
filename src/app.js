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
app.use('/api/v1', [router]);
app.use(globalErrorHandler);

app.get('/', async (req, res) => {
  res.status(200).json({ message: '서버 정상 동작중' });
});

// 정적 파일을 서빙하기 위한 설정
app.use(express.static(path.join(__dirname, 'assets')));

// 로그인 페이지 (알림 기능 사용시 토큰 필요 => 웹에서 로그인 과정도 필요..)
app.get('/auth/sign-in', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/sign-in.html');
  } catch (err) {
    next(err);
  }
});

// 주문시 사장에게 알림
app.get('/order/owner', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/index.html');
  } catch (err) {
    next(err);
  }
});

// 주문상태 변경 시 고객에게 알림
app.get('/order/customer', (req, res, next) => {
  try {
    res.sendFile(__dirname + '/assets/index.html');
  } catch (err) {
    next(err);
  }
});

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
