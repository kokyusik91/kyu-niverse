This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 큐니버스 🌍

큐식 + 유니버스를 의미하는 큐니버스는 저를 표현할 수 있는 부분드를 UI로 표현하였습니다. 현재는 대부분이 개발에 치중되어 있지만, 비 개발 분야의 유니버스들도 점차 추가할 예정입니다. 😃

## 웹 사이트 주소 😁
[http://kyu-niverse.com](http://kyu-niverse.com) 

## 둘러보기

### Resume 
Figma로 만든 이력서를 PDF 형태로 다운받아 볼 수 있습니다.




## 추가할 기능

### Clothes Slider
생각보다 해당 기능이 꽤 괜찮다는 피드백을 받았습니다. 현재는 내가 좋아하는 옷들을 


## 웹 도구 모음

### Next.js

### Tailwind css

### Notion API

## 인프라 구조

Next.js를 사용하고 있지만, 컨텐츠들 특성상 next.js 서버를 띄우고 그떄그떄 요청을 받을 필요가 없다고 판단하여, static exports 라는 기능을 사용하여 현재 정적파일들 서빙하는 방식입니다. (React 배포와 유사)   
그렇다고 Next.js의 서버기능을 아예 사용하지 않는것은 아닙니다. React Server Component를 사용하여 빌드타임때 외부 API에서 데이터를 미리 채워 놓은상태로 정적파일이 만들어집니다.  

### AWS S3 🪣
리소스들을 S3 스토리지에 저장해놓고, 정적 웹 사이트 호스팅 방식으로 웹사이트를 보여주고 있습니다. 이후 나올 CloudFront과 조합하여, CDN에서 좀 더 빠르게 웹사이트를 보여줄수 있습니다.

### Route 53 🚏
S3 주소가 아닌, 도메인 이름을 정하고 그 주소를 S3의 정적 호스팅 주소와 연결합니다.

### AWS Certificate Manager
보안 프로토콜 HTTPS를 사용하기 위해 SSL 인증서를 받을 수 있습니다.

### AWS Cloud Front

### Github Action ⏩️
개발을 완료하고 Build, Deploy 과정을 수동으로 하는데는 어느정도 시간 소요와 휴먼 에러가 발생할 수 있습니다. 인간은 거짓말을 하지만, 컴퓨터는 99.9%확률로 거짓말을 하지 않습니다.  이를 방지하기 위해 Github에서 제공하는 CI-CD를 사용하고 있습니다.   
각 stage별로 명령 등을 수행하고 대표적으로는 Build후 Deploy하는 과정이 포함되어있습니다.   
추가적으로 stage단계 중 `Github settings`에 환경변수로 등록해 놓은 value값들을 불러와 stage에서 env파일을 만들거나, s3 secret key등을 불러와 Deploy때 사용이 가능합니다.

### Slack Incoming web-hook 💬
배포가 완료하였는지, 실패하였는지의 유무를 즉각적으로 notice 받기 위해서 Slack incoming webhook을 사용하였습니다. 유무를 알기위해 Github Actions의 파이프 라인을 계속해서 모니터링하고 있는것 또한 시간 소모가 있기 떄문에 완료 혹은 실패시 다음과 같은 메시지를 받고 있습니다.   
`Deploy`가 끝나면 `webhook.sh` 내부 스크립트를 실행시키고 있습니다.

다음 AWS의 기술들을 사용하여, 개발 후 큐니버스를 웹서비스로 제공하고 있습니다. 지금은 컨텐츠가 간단하여 위의 기술들로 인프라 구성을 할 수 있지만, Next.js의 서버기능들을 점차 사용하게 되면 컴퓨팅 자원이 필요하기 때문에 현재 인프라에서 변경되어야할 구조들이 존재합니다.
