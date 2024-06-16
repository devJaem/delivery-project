## 백오피스 프로젝트
---
### Node.JS 5기
### 1조 - 데이터 물류센터
### 프로젝트 명 :  Delivery-Project
---
소개
- 매장관리, 음식주문, 등이 가능한 플랫폼 제작
- 일반 사용자는 음식을 주문하거나, 리뷰를 남기며 공유가 가능하다.
- 사장님은 백 오피스 기능을 통해, 가게와 메뉴를 관리하고 주문을 처리한다.
## Setting
1. 코드 복사하기
```bash
git clone https://github.com/devJaem/delivery-project.git .
```
2. 필요 패키지 설치
```bash
yarn
```
3. DB테이블 생성
```bash
npx prisma db push
```
4. .env.example 파일의 이름을 .env로 변경하고 아래 내용을 채움
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
email_service="gmail"
# 메일주소
user="mail@mail.com"
# password
pass="password"
# 사용자 키_ID
AWS_ACCESS_KEY_ID="key_value"
# 사용자 비밀_ID
AWS_SECRET_KEY="key_value"
# AWS Bucket Region
AWS_REGION="ap-northeast-2"
# AWS S3 Bucket Name
AWS_BUCKET_NAME="bucket_name"
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

https://www.notion.so/teamsparta/8f3d3cbed7a0411cba7095de5ba1f0a4?v=20eb3e672dd54a0d9f6f841272dd6103&pvs=4

#### ERD
---

https://dbdiagram.io/d/666d127ba179551be6f1448c