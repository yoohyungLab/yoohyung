// shortCode 생성 함수 (8자리 랜덤 문자열)
export const generateShortCode = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

// slug 생성 함수 (한글 지원)
export const generateSlug = (title: string): string => {
	if (!title || typeof title !== 'string') {
		return 'test';
	}

	// 한글을 간단한 로마자로 변환
	const koreanMap: { [key: string]: string } = {
		테: 'te',
		스: 'seu',
		트: 'teu',
		하: 'ha',
		나: 'na',
		는: 'neun',
		다: 'da',
		라: 'ra',
		마: 'ma',
		바: 'ba',
		사: 'sa',
		아: 'a',
		자: 'ja',
		차: 'cha',
		카: 'ka',
		타: 'ta',
		파: 'pa',
		가: 'ga',
		거: 'geo',
		너: 'neo',
		더: 'deo',
		러: 'reo',
		머: 'meo',
		버: 'beo',
		서: 'seo',
		어: 'eo',
		저: 'jeo',
		처: 'cheo',
		커: 'keo',
		터: 'teo',
		퍼: 'peo',
		허: 'heo',
		고: 'go',
		노: 'no',
		도: 'do',
		로: 'ro',
		모: 'mo',
		보: 'bo',
		소: 'so',
		오: 'o',
		조: 'jo',
		초: 'cho',
		코: 'ko',
		토: 'to',
		포: 'po',
		호: 'ho',
		구: 'gu',
		누: 'nu',
		두: 'du',
		루: 'ru',
		무: 'mu',
		부: 'bu',
		수: 'su',
		우: 'u',
		주: 'ju',
		추: 'chu',
		쿠: 'ku',
		투: 'tu',
		푸: 'pu',
		후: 'hu',
		그: 'geu',
		느: 'neu',
		드: 'deu',
		르: 'reu',
		므: 'meu',
		브: 'beu',
		으: 'eu',
		즈: 'jeu',
		츠: 'cheu',
		크: 'keu',
		프: 'peu',
		흐: 'heu',
		기: 'gi',
		니: 'ni',
		디: 'di',
		리: 'ri',
		미: 'mi',
		비: 'bi',
		시: 'si',
		이: 'i',
		지: 'ji',
		치: 'chi',
		키: 'ki',
		티: 'ti',
		피: 'pi',
		히: 'hi',
	};

	const slug = title
		.toLowerCase()
		.split('')
		.map((char) => koreanMap[char] || (/[a-z0-9\s]/.test(char) ? char : ''))
		.join('')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');

	return slug || 'test';
};
