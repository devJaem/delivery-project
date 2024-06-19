import express from 'express';
import http from "http";
import { Server } from "socket.io";
import { ENV } from './constants/env.constant.js';
import { globalErrorHandler } from './middlewares/error-handling.middleware.js';
import { requestLogger } from './middlewares/log.middleware.js';
import router from './routers/index.js';
import path from "path";

const __dirname = path.resolve();
const app = express();
const PORT = ENV.PORT;
const server = http.createServer(app);
const io = new Server(server);

app.use(requestLogger);
app.use(express.json());
app.use('/api/v1', [router]);
app.use(globalErrorHandler);

app.get('/', async (req, res) => {
  res.status(200).json({ message: '서버 정상 동작중' });
});


// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get("/messages", (req, res, next) => {
  try {
    res.sendFile(__dirname + "/index.html");
  } catch (err) {
    next(err);
  }
});

// 클라이언트가 소켓 서버에 연결될 때
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // 클라이언트 연결 해제 시
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


server.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
