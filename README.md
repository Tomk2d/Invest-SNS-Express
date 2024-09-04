# 함께 만들어 가는 - Stock Mate

<br/>

> 주최 : 신한투자증권
> <br/><br/>
> 주제 : 투자 전략 공유 SNS 및 모의투자 플랫폼
> <br/><br/>
> 서비스 : 웹 서비스
> <br/><br/>

<br/>
<br/>

## Team. Stock Mate
| 신의진 | 박유진 |
|:----:|:----:|
|<img src = "https://avatars.githubusercontent.com/Tomk2d" width=150px>|<img src = "https://avatars.githubusercontent.com/yjp8842" width=150px>|
| 백엔드 테크리더 | 프론트엔드 테크리더 |


| 허상진 | 박진언 |
|:----:|:----:|
|<img src = "https://avatars.githubusercontent.com/chaeheonjeong" width=150px>|<img src = "https://avatars.githubusercontent.com/eunxoo" width=150px>|
| 백엔드 팀원 | 프론트엔드 팀원 |

<br/>
<br/>

## My Role (신의진)
* 백엔드 테크리더 및 프로젝트 리딩
* 주식 개별 종목 시장가/지정가 매매 체결
* 실시간 소켓 통신
* 챗봇 모델 학습 및 서비스 구현
* AWS 인프라 설계 및 배포

<br/>
<br/>

## Contents
### 1. [About](#About)
### 2. [Tech Stacks](#Tech-Stacks)
### 3. [Project Architecture](#Project-Architecture)
### 4. [Main Features](#Main-Features)


<br/>

## About

Stock Mate 는 전략형 __투자 정보 공유__ 및 __모의투자 서비스__ 입니다. <br /> <br />

차트/보조지표를 활용하여 __나만의 투자 전략__ 을 설립하고, <br /> 
__SNS 기능__ 을 활용하여 __자신의 투자 전략__ 및 현황을 __공유__ 합니다. <br /> 
실시간 모의투자는 실제 주식 현장과 동일하게 진행됩니다. <br />  <br /> 

### 메인 기능
* 실시간 주식 개별 종목 매매
* 보조 지표를 활용한 투자 전략 수립
* 투자 SNS 기능
* 챗 메이트 - 챗봇
* 종목 분석 및 인기 주식
* 마이페이지 - 자산 관리


<br />
<br />

## Tech Stacks
![Node.js](https://img.shields.io/badge/Node.js/Express-339933?style=flat&logo=Node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=MongoDB&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat&logo=Redis&logoColor=white)
![socket](https://img.shields.io/badge/WebSocket/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)

![AWS EC2](https://img.shields.io/badge/EC2-F24E1E?style=flat-square&logo=AmazonEC2&logoColor=white)
![AWS RDS](https://img.shields.io/badge/RDS-527FFF?style=flat-square&logo=AmazonRDS&logoColor=white)
![AWS S3](https://img.shields.io/badge/S3Bucket-569A31?style=flat-square&logo=AmazonS3&logoColor=white)

<br />
<br />

## Project Architecture 
<img width="800" alt="user" src="https://github.com/user-attachments/assets/63addfe5-762c-4a15-9880-a27bc423bb46">
<img width="400" alt="user" src="https://github.com/user-attachments/assets/eef48b20-8ef8-4d14-9e4b-6c4b2f760095">

<br />
<br />

### 실시간 통신
* __Web socket__ : 서버 - 외부 api 간 실시간 통신
* __Socket.io__ : 클라이언트 - 서버 간 실시간 통신

### 이벤트 핸들링
* __Event Emitter__ : 소켓의 데이터 응답시 이벤트 발생
* 발생된 이벤트 기반으로 예약 주문 체결

### 로드 밸런싱 및 라우팅
* __PM2__ : 클러스터 모드를 활용하여 서버 클러스터링
* __NginX__ : 로드밸런싱 configuration 을 활용하여 클러스터링 된 서버 로드 밸런싱. 라우팅
* 이벤트가 중점적으로 발생하는 소켓 서버 분리

<br />
<br />

## Main Features

### 메인 페이지

<img width="800" alt="image" src="https://github.com/user-attachments/assets/8fcf3b72-8d49-491a-9dc9-50a1d479a5f4">

### 주식 종목 차트

<img width="800" alt="image" src="https://github.com/user-attachments/assets/79f76117-c7c5-4e65-89b6-35c3087c3055">

### 주식 매매 - 시장가/지정가 호가

<img width="800" alt="image" src="https://github.com/user-attachments/assets/b0cc1e25-2aff-42d0-9a11-b8f4c7562dca">

### 투자 전략 및 인기 주식

<img width="800" alt="image" src="https://github.com/user-attachments/assets/134a0ca7-1db1-467e-a7be-86d464f579d4">


### 챗 메이트 - 투자 지표 및 서비스 챗봇

<img width="800" alt="image" src="https://github.com/user-attachments/assets/53c906a2-2a53-4bfe-8045-6669093d6dbf">

### SNS - 투자 전략 공유 및 투표 등

<img width="800" alt="image" src="https://github.com/user-attachments/assets/ce41908c-377f-4c09-ba0f-0c0ef1511cb8">

### 마이페이지 - 자산 관리 및 정보

<img width="800" alt="image" src="https://github.com/user-attachments/assets/b0d021de-0b49-4b91-b61b-83abc8f6efe6">

