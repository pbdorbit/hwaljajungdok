# React + Node.js

(1) 서버 실행

```bash
cd /server
node index.js //port:4000
```

(2) 클라이언트 실행

```bash
cd /client
npm run start
```

# 다이어그램들

## 시스템 아키텍처

인프라 전체 구조 : `AWS`, `EC2`, `nginx`, `PM2`

```mermaid
graph TD
    User([사용자 브라우저])

    subgraph AWS["AWS Cloud"]
        subgraph VPC["Default VPC"]
            subgraph EC2["EC2 t3.micro — Ubuntu 22.04"]
                nginx["nginx<br/>port 80<br/>React 정적 파일 서빙"]
                node["Node.js + Socket.io<br/>port 4000<br/>PM2로 프로세스 관리"]
                build["/var/www/html<br/>React Build 파일"]
            end
        end
        SG["보안그룹<br/>HTTP 80 · TCP 4000 · SSH 22"]
    end

    User -->|"HTTP 요청 :80"| nginx
    nginx --> build
    User -->|"WebSocket :4000"| node
    SG -.->|인바운드 규칙 적용| EC2
```

## 시퀀스 다이어그램

실시간 채팅 흐름: `WebSocket`, `Socket.io`, `실시간 통신`

```mermaid
sequenceDiagram
    actor A as 유저 A
    actor B as 유저 B
    participant nginx as nginx (port 80)
    participant server as Node.js Server (port 4000)

    A->>nginx: HTTP GET / (페이지 요청)
    nginx-->>A: React 빌드 파일 응답

    A->>server: WebSocket 연결 요청
    server-->>A: 연결 수립 (connection)

    A->>server: emit join (name, room)
    server-->>A: emit message (입장 환영)
    server-->>B: emit roomData (유저 목록 갱신)

    A->>server: emit sendMessage
    server-->>A: emit message (브로드캐스트)
    server-->>B: emit message (브로드캐스트)

    A->>server: disconnect
    server-->>B: emit message (퇴장 알림)
```

## 배포 플로우차트

배포 과정 전체: `CI/CD 없는 수동 배포`

```mermaid
flowchart TD
    A([로컬 개발 완료]) --> B[EC2 인스턴스 생성<br/>t2.micro · Ubuntu 22.04]
    B --> C[보안그룹 설정<br/>80 · 4000 · 22 포트 오픈]
    C --> D[SSH 접속<br/>ssh -i key.pem ubuntu@IP]
    D --> E[Node.js 20 설치<br/>nvm or nodesource]
    E --> F[git clone<br/>github 레포 클론]
    F --> G[서버 의존성 설치<br/>cd server && npm install]
    G --> H[PM2로 서버 실행<br/>pm2 start index.js]
    H --> I[클라이언트 빌드<br/>cd client && npm run build]
    I --> J[nginx 설치 및 설정<br/>빌드 파일 → /var/www/html]
    J --> K([배포 완료 <br/>http://EC2-IP 접속 가능])
```
