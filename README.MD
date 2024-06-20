# 백오피스 프로젝트

### Node.JS 5기
### 1조 - 데이터 물류센터
### 프로젝트 :  Delivery-Project
### 프로젝트 설명: 음식을 주문하고, 매장을 관리할수 있는 플랫폼 입니다. <br>이 서비스를 이용해 리뷰를 작성하고 다른사람과 경험을 공유할수 있습니다.
# 팀 소개
> 팀명: 데이터 물류센터 <br>
> 팀명 설명: 택배 상하차와, 데이터 상하차는 한끝차이 <br>
> 인원: 팀장 정재민, 팀원 진수현, 서지민, 이성운, 노강민<br>
# 역할 분담
- 팀장 정재민
  - 회원가입
    - 이메일 발송, 인증 
  - 미들웨어
    - 토큰인증
    - S3
  - 프로젝트 관리
  - HTTPS, 로드밸런서 적용
- 팀원 진수현
  - 메뉴 API
  - CART API
  - 주문 API
  - 주소 API
- 팀원 서지민
  - 발표준비
  - 발표
  - API 명세서 확인
- 팀원 이성운
  - 음식점 API
  - REVIEW API
  - 검색
  - 랭킹
- 팀원 노강민
  - 발표준비
  - API 명세서 확인
  - 통합테스트
---
## 기술

### BACKEND
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)

### TOOLS
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white) ![GitHub](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white) ![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white) ![dbdiagram](https://img.shields.io/badge/dbdiagram-007ACC?style=for-the-badge&logo=drawsql&logoColor=white)

## 프로젝트 설치 및 실행 방법

## Setting
1. 코드 복사하기
```bash
git clone https://github.com/devJaem/delivery-project.git .
```
2. 필요 패키지 설치
```bash
yarn install
```
3. .env.example 파일의 이름을 .env로 변경하고 아래 내용을 채움
```bash
# MY SQL URL (아이디, 비밀번호 포함)
DATABASE_URL="mysql://계정이름:비밀번호@주소:포트/DB명"
# 포트번호 (정수)
PORT=서버포트
# Access Token key
ACCESS_SECRET_KEY="key_value"
# Refresh Token key
REFRESH_SECRET_KEY="key_value"
# E-mail 서비스
EMAIL_SERVICE="naver"
# SMTP 주소
EMAIL_HOST="smtp.naver.com"
# EMAIL PORT
EMAIL_PORT=465
# 메일주소
USER_EMAIL="mail@mail.com"
# password
USER_PASSWORD="password"
# 사용자 키_ID
AWS_ACCESS_KEY_ID="key_value"
# 사용자 비밀_ID
AWS_SECRET_KEY="key_value"
# AWS Bucket Region
AWS_REGION="ap-northeast-2"
# AWS S3 Bucket Name
AWS_BUCKET_NAME="bucket_name"
```
4. DB테이블 생성
```bash
npx prisma db push
```
5. 서버 실행하기 
```bash
# 배포용
yarn start 
# 개발용 
yarn dev
```
--- 

## API 명세
---

https://www.notion.so/teamsparta/8f3d3cbed7a0411cba7095de5ba1f0a4?v=20eb3e672dd54a0d9f6f841272dd6103&pvs=4

## ERD
---

https://dbdiagram.io/d/666d127ba179551be6f1448c