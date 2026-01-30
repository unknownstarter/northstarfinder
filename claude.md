# Project: northstarfinder

## 개요
Business Projection Builder — 사용자가 Factor(변수)를 정의하고 수식/조건식을 입력해, 시간에 따른 지표/매출 변화를 시뮬레이션하는 범용 웹앱.

## 핵심 원칙
- 특정 서비스 로직을 하드코딩하지 않는다.
- 수식은 문자열로 입력받아 mathjs로 계산한다.
- Formula Factor 간 의존성은 그래프로 풀고, 순환참조는 에러 처리한다.
- Projection 결과는 표/차트/엑셀로 제공한다.

## 용어
- **Input Factor**: baseValue + growth(선형/복리)로 시계열 확장되는 값
- **Formula Factor**: expression으로 계산되는 값 (다른 factor 참조 가능)
- **Constraint/IF**: if(condition, a, b) 형태를 지원

## Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS, HeroUI
- **Backend**: Node.js, PostgreSQL, Supabase
- **Infra/Tools**: Git, Vercel, Firebase, GA4

## 품질 기준
- 의존성 정렬(topological sort) + 사이클 감지 필수
- 파싱/미정의 참조/NaN은 사용자에게 설명 가능한 에러로 노출
- MVP는 단일 시나리오, 추후 멀티 시나리오 확장 가능 구조로

## 응답 규칙
- **언어**: 항상 한국어로 응답.
- **톤**: 간결하고 전문적. 기본 개념 설명 생략, 핵심 구현 위주.
- **코드**: 수정된 부분만 표시. 전체 코드 반복 금지.
- **커밋**: Conventional Commits 형식 준수.

## 명령어
- `npm run dev` — 로컬 서버 실행
- `npm run build` — 프로젝트 빌드
- `npm test` — 테스트 실행

## 스킬 참조
각 역할별 상세 규칙은 아래 파일 참고:
- `dev-skill.md` — Senior Full-stack Engineer
- `plan-skill.md` — Product Manager
- `design-skill.md` — Senior Product Designer
- `data-skill.md` — Data Analyst
- `marketing-skill.md` — Growth Marketer / Copywriter
