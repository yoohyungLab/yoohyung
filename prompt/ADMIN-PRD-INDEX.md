# Admin PRD Index

## 1. Overview

- 1.1 Purpose
- 1.2 Target Users
- 1.3 System Architecture
- 1.4 Technology Stack

## 2. Authentication & Authorization

- 2.1 Admin Login Page
  - 2.1.1 Login Form
  - 2.1.2 Authentication Flow
  - 2.1.3 Error Handling
  - 2.1.4 Session Management
- 2.2 Access Control
  - 2.2.1 Route Protection
  - 2.2.2 Permission Management

## 3. Dashboard

- 3.1 Overview
  - 3.1.1 KPI Cards
    - 활성 테스트
    - 오늘 응답
    - 오늘 방문자
    - 완료율
  - 3.1.2 Real-time Activity
  - 3.1.3 Popular Tests Card
  - 3.1.4 Quick Actions
- 3.2 Data Refresh
- 3.3 Navigation

## 4. Test Management

- 4.1 Test List Page
  - 4.1.1 Statistics Cards
    - 전체 테스트
    - 공개
    - 초안
    - 예약
    - 총 참여
  - 4.1.2 Search & Filters
    - 검색
    - 상태 필터
  - 4.1.3 Bulk Actions
    - 공개/비공개
    - 삭제
  - 4.1.4 Test Table
    - 테스트명
    - 유형
    - 상태
    - 참여수
    - 생성일
    - 액션 (편집, 상태 변경, 삭제)
  - 4.1.5 Test Detail Modal
  - 4.1.6 Pagination
- 4.2 Test Creation Page
  - 4.2.1 Step Indicator
  - 4.2.2 Step 1: Type Selection
    - 테스트 유형 선택
      - 심리형
      - 밸런스형
      - 캐릭터 매칭형
      - 퀴즈형
      - 밈형
      - 라이프스타일형
  - 4.2.3 Step 2: Basic Information
    - 테스트 제목
    - 테스트 코드 (공유용)
    - 테스트 설명
    - 시작 문구
    - 썸네일 이미지 업로드
    - 카테고리 선택
    - 예상 소요 시간
    - 최대 점수
    - 성별 필수 여부
    - 공개/비공개 상태
  - 4.2.4 Step 3: Question Creation
    - 질문 추가/삭제
    - 질문 텍스트
    - 질문 이미지 업로드
    - 질문 유형 (객관식, 주관식)
    - 선택지 추가/삭제/순서 변경
    - 선택지 텍스트
    - 선택지 점수
    - 정답 설정 (퀴즈형)
    - 설명 추가
  - 4.2.5 Step 4: Result Configuration
    - 결과 추가/삭제/순서 변경
    - 결과명
    - 결과 설명
    - 배경 이미지 업로드
    - 테마 색상
    - 매칭 조건 설정
      - 점수 범위
      - 선택지 코드
    - 결과별 기능 설정
    - 성별 타겟팅
  - 4.2.6 Step 5: Preview & Publish
    - 테스트 정보 미리보기
    - 질문 목록 미리보기
    - 결과 목록 미리보기
    - 체크리스트 확인
    - 저장 및 발행
- 4.3 Test Edit Page
  - 4.3.1 기존 데이터 로드
  - 4.3.2 5단계 수정 프로세스
  - 4.3.3 미리보기 링크
  - 4.3.4 업데이트 저장

## 5. Category Management

- 5.1 Category List Page
  - 5.1.1 Statistics Cards
    - 전체
    - 활성
    - 비활성
  - 5.1.2 Search & Filters
    - 검색
    - 상태 필터
  - 5.1.3 Actions
    - 순서 변경
    - 카테고리 추가
  - 5.1.4 Bulk Actions
    - 활성화/비활성화
  - 5.1.5 Category Table
    - 카테고리명
    - 순서
    - 상태
    - 생성일
    - 액션 (편집, 상태 변경, 삭제)
  - 5.1.6 Pagination
- 5.2 Category Create/Edit Modal
  - 5.2.1 카테고리명
  - 5.2.2 Slug
  - 5.2.3 순서
  - 5.2.4 상태
- 5.3 Category Sort Modal
  - 5.3.1 드래그 앤 드롭 순서 변경

## 6. User Management

- 6.1 User List Page
  - 6.1.1 Statistics Cards
    - 활성 사용자
    - 비활성
    - 탈퇴
  - 6.1.2 User Sync Button
  - 6.1.3 Search & Filters
    - 검색
    - 상태 필터
    - 가입 경로 필터
  - 6.1.4 Bulk Actions
    - 활성화
    - 비활성화
    - 탈퇴 처리
  - 6.1.5 User Table
    - 이메일
    - 이름 (아바타 포함)
    - 가입 경로
    - 상태
    - 가입일
    - 액션 (상태 변경, 삭제)
  - 6.1.6 User Detail Modal
    - 사용자 기본 정보
    - 테스트 참여 내역
    - 응답 통계
- 6.2 User Actions
  - 6.2.1 상태 변경
  - 6.2.2 탈퇴 처리
  - 6.2.3 동기화

## 7. User Response Management

- 7.1 Response Analysis Page
  - 7.1.1 Page Header
  - 7.1.2 Response Filters
    - 검색
    - 테스트 필터
    - 카테고리 필터
    - 디바이스 필터
    - 날짜 범위
    - 데이터 내보내기
  - 7.1.3 Response Statistics Cards
    - 총 응답수
    - 완료된 응답
    - 완료율
    - 평균 완료 시간
    - 모바일 비율
    - 고유 사용자
  - 7.1.4 Detailed Statistics
    - 디바이스 분포
    - 완료 현황
    - 평균 소요시간

## 8. Feedback Management

- 8.1 Feedback List Page
  - 8.1.1 Statistics Cards
    - 전체
    - 검토중
    - 진행중
    - 완료
    - 답변완료
    - 반려
  - 8.1.2 Search & Filters
    - 검색
    - 상태 필터
    - 카테고리 필터
  - 8.1.3 Bulk Actions
    - 진행중으로
    - 완료로
    - 반려
  - 8.1.4 Feedback Table
    - 제목 (내용 포함)
    - 파일 첨부 표시
    - 카테고리
    - 작성자
    - 상태
    - 작성일
    - 조회수
    - 액션 (답변, 상태 변경, 삭제)
  - 8.1.5 Pagination
- 8.2 Feedback Detail Modal
  - 8.2.1 피드백 상세 정보
  - 8.2.2 첨부 파일
  - 8.2.3 답변 작성 버튼
- 8.3 Feedback Reply Modal
  - 8.3.1 답변 작성 폼
  - 8.3.2 답변 저장

## 9. Analytics

- 9.1 Analytics Overview Page
  - 9.1.1 Statistics Cards
    - 전체 테스트
    - 발행됨
    - 초안
    - 예약됨
    - 총 응답수
    - 완료율
  - 9.1.2 Search & Filters
    - 검색
    - 상태 필터
    - 카테고리 필터
    - 시간 범위 필터
  - 9.1.3 Test Analytics Table
    - 테스트명
    - 상태
    - 응답수
    - 완료율
    - 평균 소요시간
    - 생성일
  - 9.1.4 Pagination
- 9.2 Test Analytics Detail Page
  - 9.2.1 Analytics Header
    - 테스트 정보
    - 시간 범위 선택
    - 뒤로가기
  - 9.2.2 Analytics Statistics Cards
    - 응답수
    - 완료수
    - 완료율
    - 평균 소요시간
    - 평균 점수
    - 디바이스 분포
  - 9.2.3 Analytics Tabs
    - Overview Tab
      - 완료율 차트
      - 결과 분포
      - 공유 성과
    - Trends Tab
      - 트렌드 요약
      - 트렌드 차트
    - Funnel Tab
      - 퍼널 요약
      - 퍼널 시각화
      - 질문별 상세 분석

## 10. Growth Analysis

- 10.1 Growth Page
  - 10.1.1 Page Header
  - 10.1.2 GA Guide Cards
    - 트래픽 획득
    - 사용자 획득
    - 실시간 분석
  - 10.1.3 Additional Analysis Guide
    - 기술 분석
    - 인구통계 분석
  - 10.1.4 Google Analytics Link

## 11. Common Components & Layout

- 11.1 Admin Layout
  - 11.1.1 Sidebar
    - 사이드바 토글
    - 네비게이션 메뉴
    - 섹션 구분
    - 활성 상태 표시
  - 11.1.2 Header
    - 사용자 정보
    - 로그아웃 버튼
  - 11.1.3 Main Content Area
- 11.2 Common UI Components
  - 11.2.1 DataTable
  - 11.2.2 FilterBar
  - 11.2.3 BulkActions
  - 11.2.4 StatsCards
  - 11.2.5 DataState (Loading, Error, Empty)
  - 11.2.6 AdminCard
  - 11.2.7 Pagination
- 11.3 Form Components
  - 11.3.1 DefaultInput
  - 11.3.2 DefaultTextarea
  - 11.3.3 DefaultSelect
  - 11.3.4 Switch
  - 11.3.5 Image Upload
- 11.4 Modal Components
  - 11.4.1 Test Detail Modal
  - 11.4.2 User Detail Modal
  - 11.4.3 Feedback Detail Modal
  - 11.4.4 Feedback Reply Modal
  - 11.4.5 Category Create/Edit Modal
  - 11.4.6 Category Sort Modal

## 12. Data Management

- 12.1 State Management
  - 12.1.1 TanStack Query
  - 12.1.2 Query Keys
  - 12.1.3 Local State
- 12.2 Data Fetching
  - 12.2.1 Service Layer
  - 12.2.2 Error Handling
  - 12.2.3 Loading States
- 12.3 Form State Management
  - 12.3.1 Test Creation Form Provider
  - 12.3.2 React Hook Form
  - 12.3.3 Validation

## 13. Error Handling & Validation

- 13.1 Form Validation
- 13.2 API Error Handling
- 13.3 User Feedback
  - 13.3.1 Success Messages
  - 13.3.2 Error Messages
  - 13.3.3 Loading States

## 14. Performance & Optimization

- 14.1 Data Loading Strategy
- 14.2 Caching
- 14.3 Code Splitting
- 14.4 Image Optimization



