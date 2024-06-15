### Setting
1. 코드 복사하기
```bash
git clone https://github.com/devJaem/marketplace.git .
```
2. 필요 패키지 설치
```bash
yarn
```
3. DB테이블 생성
```bash
yarn prisma db push
```
4. .env.example 파일의 이름을 .env로 변경하고 아래 내용을 채움
```bash
# MY SQL URL (아이디, 비밀번호 포함)
DATABASE_URL="mysql://계정이름:비밀번호@주소:포트/DB명"
# 포트번호 (정수)
PORT=서버포트
# Access Token key
ACCESS_SECRET_KEY="key value"
# Refresh Token key
REFRESH_SECRET_KEY="key value"

```
5. 서버 실행하기 
```bash
# 배포용 (pm2로 실행)
yarn start 
# 개발용 (nodemon 실행)
yarn dev
```

#### 폴더구조
---
```

```

#### API 명세
---
https://devjeam.notion.site/Node-js-API-6024911b8cfb477cb106b290770cf9d4

#### ERD
---
https://drawsql.app/teams/recruit-hub/diagrams/recruit-hub