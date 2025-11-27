import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jwtVerify } from 'https://deno.land/x/jose@v4.14.4/index.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
	// CORS preflight 요청 처리
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		// Authorization 헤더에서 토큰 추출
		const authHeader = req.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new Response(
				JSON.stringify({ error: '토큰이 제공되지 않았습니다.' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const token = authHeader.replace('Bearer ', '');

		// JWT Secret 가져오기
		const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET') ?? '';
		if (!jwtSecret) {
			throw new Error('JWT Secret이 설정되지 않았습니다.');
		}

		// JWT 토큰 검증
		const secret = new TextEncoder().encode(jwtSecret);
		let payload;

		try {
			const result = await jwtVerify(token, secret);
			payload = result.payload;
		} catch (error) {
			return new Response(
				JSON.stringify({ error: '토큰이 유효하지 않습니다.' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Supabase 클라이언트 생성
		const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
		const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

		if (!supabaseUrl || !supabaseServiceKey) {
			throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
		}

		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// 사용자 조회
		const { data: user, error } = await supabase
			.from('admin_users')
			.select('id, email, username, name, is_active')
			.eq('id', payload.sub as string)
			.eq('is_active', true)
			.single();

		if (error || !user) {
			return new Response(
				JSON.stringify({ error: '사용자를 찾을 수 없습니다.' }),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// 사용자 정보 반환
		return new Response(
			JSON.stringify({
				id: user.id,
				email: user.email,
				username: user.username,
				name: user.name,
				is_active: user.is_active,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('[Admin Verify Error]', error);
		return new Response(
			JSON.stringify({ error: error.message || '토큰 검증에 실패했습니다.' }),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});

