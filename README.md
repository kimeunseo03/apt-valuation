# 🏢 아파트 가치평가 시스템

국토교통부 공공데이터 + 네이버 지오코더 + Claude AI 기반 아파트 정밀 가치평가 시스템

## 🔑 사용 API

| API | 용도 | 인증키 |
|-----|------|--------|
| 국토교통부 아파트 매매 실거래가 | 실거래가 수집 | 공공데이터 포털 |
| 국토교통부 아파트 전월세 실거래가 | 전월세 수집 | 공공데이터 포털 |
| 국토교통부 공동주택 단지 목록 | 단지 정보 | 공공데이터 포털 |
| 행정안전부 법정동코드 | 지역코드 변환 | 공공데이터 포털 |
| 네이버 지오코더 | 주소 → 좌표 정규화 | 네이버 클라우드 |
| 네이버 지역 검색 | 아파트 POI 검색 | 네이버 클라우드 |
| Claude Sonnet API | AI 가치평가 분석 | Anthropic |

## 🚀 GitHub + Vercel 배포 방법

### 1. GitHub 저장소 생성 후 파일 업로드

```bash
git init
git add .
git commit -m "init: 아파트 가치평가 시스템"
git remote add origin https://github.com/YOUR_USERNAME/apt-valuation.git
git push -u origin main
```

### 2. Vercel 연결

1. [vercel.com](https://vercel.com) 접속 → New Project
2. GitHub 저장소 선택
3. **Environment Variables** 설정:

| 변수명 | 값 |
|--------|-----|
| `VWORLD_API_KEY` | `E9CD8059-EBAF-3B6E-88CB-B5D0713550B0` |

> 💡 VWorld API 키: https://www.vworld.kr → 로그인 → API 신청 → 인증키 확인

### 3. 공공데이터 인증키
이미 `apartment-valuation.html` 파일 내 하드코딩되어 있습니다.
```
PUBLIC_API_KEY: 079cee9fbe1bee92d209ce6f5fc7c5456abfc6c45ca380fd34daa54c48be5ef5
```

### 4. Anthropic API (선택)
Claude AI 분석 기능 사용 시 브라우저에서 직접 호출합니다.
(API 키는 앱 내에서 입력하거나 로컬 `.env.local` 파일에 설정)

## 📊 기능

- **등본 PDF/이미지 업로드** → 주소·면적·건축연도 자동 추출
- **네이버 지오코더** → 주소 정규화 및 좌표 검증
- **면적 ±5% 필터** + **이상값 제거(σ=1.5)** → 정밀 실거래 매칭
- **오차범위 ±3~8%** (실거래 건수에 따라 자동 조정)
- **24개월 가격 추세** + 실거래 산점도
- **인근 단지 시세 비교** 테이블

## 📁 파일 구조

```
apt-valuation/
├── apartment-valuation.html   # 메인 앱
├── api/
│   ├── proxy.js               # 공공데이터 CORS 프록시
│   ├── naver-geo.js           # 네이버 지오코더 프록시
│   └── naver-search.js        # 네이버 검색 프록시
├── public/
│   └── index.html             # 리다이렉트
├── vercel.json                # Vercel 설정
└── README.md
```

## ⚠️ 주의사항

- 본 시스템은 참고용입니다. 최종 투자 결정 시 공인중개사·전문가 상담 필수
- 공공데이터 API는 실거래 신고 후 약 1~2개월 뒤 반영됩니다
