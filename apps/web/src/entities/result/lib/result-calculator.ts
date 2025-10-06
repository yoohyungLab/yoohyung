import type { EgenTetoResult, Gender } from '@/shared/types';

// ✅ 새 타입
export type Dominant = 'egen' | 'teto' | 'mix';

// ✅ 에겐/테토 우세 판단
export function getDominantType(egenPct: number, tetoPct: number): Dominant {
	if (Math.abs(egenPct - tetoPct) < 10) return 'mix';
	return egenPct > tetoPct ? 'egen' : 'teto';
}

// ✅ 퍼센트대별 접두사(간결·직관)
function bandAdjective(pct: number) {
	if (pct >= 80) return '찐';
	if (pct >= 60) return '강한';
	if (pct >= 40) return '균형';
	if (pct >= 20) return '은근';
	return '스몰';
}

// ✅ 결과 닉네임: "찐 에겐녀 / 강한 테토남" 형태
export function getTypeNickname(egenPct: number, tetoPct: number, gender: Gender): string {
	const dom = getDominantType(egenPct, tetoPct);
	if (dom === 'mix') return `밸런스${gender === 'female' ? '녀' : '남'}`;
	const pct = dom === 'egen' ? egenPct : tetoPct;
	const adj = bandAdjective(pct);
	const core = dom === 'egen' ? '에겐' : '테토';
	const suffix = gender === 'female' ? '녀' : '남';
	return `${adj} ${core}${suffix}`;
}

// ✅ 제목 색상 단순화(성별 색 x → 타입 기반)
export function getTitleColorByType(dom: Dominant): string {
	if (dom === 'egen') return 'text-blue-600';
	if (dom === 'teto') return 'text-rose-600';
	return 'text-violet-600'; // mix
}

// ✅ 비중 게이지 표시용
export function getEgenTetoBreakdown(egenPct: number, tetoPct: number) {
	const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
	return { egen: clamp(egenPct), teto: clamp(tetoPct) };
}

// ✅ 10·20대 취향 중심 "케미 태그" (이전 '분석가형/계획자형' 제거)
export function getChemistryTags(egenPct: number, tetoPct: number): string[] {
	const dom = getDominantType(egenPct, tetoPct);
	const strong = Math.max(egenPct, tetoPct);

	if (dom === 'egen') {
		if (strong >= 60) return ['🔥 추진력 폭발', '🎉 텐션 메이커', '🗣️ 직진 토크', '📣 리드 잘함'];
		return ['🙂 선톡 잘함', '🤝 친화력', '🎵 플리공유 좋아함', '📍 약속 리드'];
	}
	if (dom === 'teto') {
		if (strong >= 60) return ['🧠 깊은 몰입', '📚 계획 장인', '🧊 쿨헤드', '🎯 집중력'];
		return ['🕊️ 잔잔한 케미', '🗓️ 차분한 계획', '🧩 디테일 챙김', '🎧 혼코 즐김'];
	}
	// mix
	return ['⚖️ 밸런스 케미', '🔁 상황 맞춤', '🌈 TPO 파괴자', '🧃 담백+센스'];
}

// ✅ 10·20대가 좋아할 "취향 픽"(놀거리/무드)
export function getYouthPicks(egenPct: number, tetoPct: number): string[] {
	const dom = getDominantType(egenPct, tetoPct);
	if (dom === 'egen') return ['즉흥 드라이브', '페스티벌/콘서트', '단체 보드게임', '브이로그 찍기'];
	if (dom === 'teto') return ['카페 탐방(조용한)', '전시·서점 데이트', '플레이리스트 큐레이션', '집콕 무드등'];
	return ['피크닉+폴라로이드', '영화/OTT 토론', '카페 → 산책 루트', '소소한 챌린지'];
}

// ✅ (선택) 기존 Career 제안은 유지가 필요하면 이름만 소폭 순화
export function getCareerSuggestionsLite(egenPct: number, tetoPct: number): string[] {
	const dom = getDominantType(egenPct, tetoPct);
	if (dom === 'egen') return ['리더/동아리장', '행사 운영/운영스태프', '영상·콘텐츠 크리에이터', '행사 MC/사회'];
	if (dom === 'teto') return ['기획/운영 보조', '디자인·편집', '데이터/리서치', '문서 정리/아카이빙'];
	return ['협업 PM 보조', '커뮤니티 매니저', '콘텐츠 큐레이터', '튜터·스터디 리더'];
}

// ============================================================================
// 새로운 PRD 요구사항에 맞는 함수들
// ============================================================================

// 점수와 성별에 따른 에겐/테토 유형 반환
export function getPersonalityType(score: number, gender: 'male' | 'female'): string {
	const suffix = gender === 'male' ? '남' : '녀';

	if (score >= 80) return `도전적인 에겐${suffix}`;
	if (score >= 60) return `활발한 에겐${suffix}`;
	if (score >= 40) return `균형잡힌 에겐${suffix}`;
	if (score >= 20) return `신중한 테토${suffix}`;
	return `차분한 테토${suffix}`;
}

// 점수와 성별에 따른 제목 색상 반환
export function getTitleColor(score: number, gender: 'male' | 'female'): string {
	if (score >= 80) return gender === 'male' ? 'text-blue-600' : 'text-pink-600';
	if (score >= 60) return gender === 'male' ? 'text-green-600' : 'text-purple-600';
	if (score >= 40) return gender === 'male' ? 'text-yellow-600' : 'text-rose-600';
	if (score >= 20) return gender === 'male' ? 'text-gray-600' : 'text-indigo-600';
	return gender === 'male' ? 'text-slate-600' : 'text-teal-600';
}

// 점수에 따른 호환성 있는 성향들 반환 (에겐/테토 기반)
export function getCompatibility(score: number): string[] {
	if (score >= 80) {
		return ['도전적인 에겐녀', '활발한 에겐남', '리더십 에겐녀', '모험가 에겐남'];
	}
	if (score >= 60) {
		return ['사교적인 에겐녀', '활동적인 에겐남', '열정적인 에겐녀', '추진력 있는 에겐남'];
	}
	if (score >= 40) {
		return ['조화로운 에겐녀', '중재자 에겐남', '안정적인 에겐녀', '협력적인 에겐남'];
	}
	if (score >= 20) {
		return ['신중한 테토녀', '계획적인 테토남', '분석적인 테토녀', '사색가 테토남'];
	}
	return ['차분한 테토녀', '관찰자 테토남', '완벽주의 테토녀', '평화주의 테토남'];
}

// 점수 범위별 결과 타입 반환
export function getResultType(score: number): EgenTetoResult {
	// 이 함수는 실제 테스트 로직에 따라 수정해야 합니다
	if (score >= 70) return 'egen-male';
	if (score >= 50) return 'egen-female';
	if (score >= 30) return 'teto-male';
	if (score >= 10) return 'teto-female';
	return 'mixed';
}

// 에겐/테토 비중 계산
export function getEgenTetoRatio(score: number): {
	egen: number;
	teto: number;
} {
	return {
		egen: score,
		teto: 100 - score,
	};
}

// 에겐/테토 비중에 따른 설명
export function getEgenTetoDescription(score: number): string {
	if (score >= 80) {
		return '에겐 성향이 매우 강합니다. 적극적이고 도전적인 성격으로 새로운 일에 거리낌없이 도전합니다.';
	}
	if (score >= 60) {
		return '에겐 성향이 강합니다. 활발하고 사교적인 성격으로 주변 사람들과 잘 어울립니다.';
	}
	if (score >= 40) {
		return '에겐과 테토가 균형잡혀 있습니다. 상황에 따라 적절히 대응할 수 있는 유연한 성격입니다.';
	}
	if (score >= 20) {
		return '테토 성향이 강합니다. 신중하고 차분한 성격으로 깊이 있게 생각하는 편입니다.';
	}
	return '테토 성향이 매우 강합니다. 조용하고 사려깊은 성격으로 혼자만의 시간을 소중히 여깁니다.';
}

// 점수에 따른 상세 설명 반환
export function getDetailedDescription(score: number): string {
	if (score >= 80) {
		return '당신은 타고난 리더십을 가지고 있으며, 새로운 도전을 두려워하지 않는 진취적인 성격입니다. 목표 달성을 위해 적극적으로 행동하며, 변화를 주도하는 것을 좋아합니다.';
	}
	if (score >= 60) {
		return '활발하고 사교적인 성격으로 다른 사람들과 잘 어울리며, 에너지가 넘치는 활동을 선호합니다. 긍정적인 마인드로 주변에 좋은 영향을 미칩니다.';
	}
	if (score >= 40) {
		return '균형감각이 뛰어나며 상황에 따라 유연하게 대처할 수 있는 능력을 가지고 있습니다. 조화를 중시하며 안정적인 관계를 선호합니다.';
	}
	if (score >= 20) {
		return '신중하고 분석적인 성격으로 결정을 내리기 전에 충분히 생각하는 편입니다. 계획성이 있고 체계적으로 일을 처리하는 것을 좋아합니다.';
	}
	return '조용하고 사려깊은 성격으로 깊이 있는 사고를 하며, 혼자만의 시간을 소중히 여깁니다. 완벽함을 추구하고 세심한 관찰력을 가지고 있습니다.';
}

// 성격 키워드 반환 (result-header.tsx에서 사용)
export function getPersonalityKeyword(score: number, gender: 'male' | 'female'): string {
	return getPersonalityType(score, gender);
}

// 커리어 제안: 10·20대 친화(학내 활동/대외활동/아르바이트/인턴·주니어 직무 중심)
export function getCareerSuggestions(egenPct: number, tetoPct: number): string[] {
	const dom = getDominantType(egenPct, tetoPct);
	const strong = Math.max(egenPct, tetoPct);

	// 에겐 우세 & 강함
	const egenStrong = [
		'마케팅/그로스 주니어',
		'세일즈(인바운드)',
		'프로덕트 매니저 보조',
		'이벤트/프로모션 운영',
		'커뮤니티 매니저',
		'영상·숏폼 크리에이터',
		'행사 MC/사회',
		'광고기획 보조(브랜딩/매체)',
		'스타트업 운영(오퍼레이션)',
		'BDR(영업개발)',
		'PR 어시스턴트',
		'사용자 인터뷰어',
		'창업 동아리 리더',
		'스튜던트 앰배서더',
		'캠퍼스 투어 가이드',
		'CS/고객성공 주니어',
	];

	// 에겐 우세 & 중·약
	const egenMild = [
		'동아리 운영진',
		'행사 스태프',
		'콘텐츠 기획 보조',
		'SNS 채널 운영',
		'튜터·스터디 리더',
		'유튜브/틱톡 숏폼',
		'오픈채팅 커뮤니티 운영',
		'대외활동(홍보단)',
		'퍼실리테이터',
		'브랜드 홍보대사',
		'리테일 판매 아르바이트',
		'교육캠프 멘토',
	];

	// 테토 우세 & 강함
	const tetoStrong = [
		'데이터 분석 인턴/주니어',
		'UX 리서처 주니어',
		'서비스 기획(문서/와이어)',
		'브랜드/편집 디자인',
		'프론트엔드/앱 주니어',
		'회계/경영지원',
		'콘텐츠 에디터·카피',
		'리서치 어시스턴트',
		'품질관리/QA',
		'로컬라이제이션·번역',
		'아카이브/기록관리',
		'도서관 사서 보조',
		'교육 커리큘럼 기획',
		'프로덕트 오퍼레이션',
		'데브옵스 툴링 보조',
		'데이터 라벨링/클리닝',
	];

	// 테토 우세 & 중·약
	const tetoMild = [
		'문서 정리·자료조사',
		'노션/위키 관리',
		'디자인 어시스턴트',
		'에디팅/교열',
		'과목 튜터링',
		'연구실 인턴',
		'코딩 동아리 백오피스',
		'서점/문구 매장',
		'주문/재고 관리',
		'스케줄러·운영 보조',
		'QA 테스터',
		'도서/전시 안내',
	];

	// 밸런스형
	const mixAll = [
		'프로젝트 PM 보조',
		'크로스팀 커뮤니케이터',
		'서비스 운영(현장/온라인)',
		'행사 콘텐츠×운영 하이브리드',
		'프로덕트 애널리틱스 보조',
		'마케팅×데이터 협업',
		'CX 개선 태스크포스',
		'창업지원단 서포터즈',
		'커뮤니티·콘텐츠 큐레이터',
		'교육/워크숍 진행',
		'스튜디오 운영 보조',
		'브랜드 콜라보 코디네이터',
		'사용자 테스트 제작/관리',
		'파트너십 번들 세일즈',
		'HR 리크루팅 코디네이터(주니어)',
		'캠퍼스 행사 총괄 보조',
	];

	let pool: string[] = [];
	if (dom === 'egen') pool = strong >= 60 ? egenStrong : egenMild;
	else if (dom === 'teto') pool = strong >= 60 ? tetoStrong : tetoMild;
	else pool = mixAll;

	// 중복 제거 및 상위 12개만 표기(칩 과밀 방지)
	return Array.from(new Set(pool)).slice(0, 12);
}

// (선택) 결과 하단에 노출할 안전한 안내 문구
export function getResultDisclaimer(): string {
	return [
		'※ 본 결과는 진단이나 치료 목적이 아닌, 자기이해와 진로 탐색을 돕기 위한 참고 정보입니다.',
		'※ 같은 유형이라도 개인의 경험·환경에 따라 선호와 강점은 달라질 수 있습니다.',
		'※ 진로 결정은 실제 경험(수업/과제/동아리/아르바이트/인턴)과 상담을 통해 단계적으로 검증해 보세요.',
	].join('\n');
}
