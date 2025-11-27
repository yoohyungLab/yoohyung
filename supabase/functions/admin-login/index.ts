import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SignJWT } from 'https://deno.land/x/jose@v4.14.4/index.ts';

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
		const { email, password } = await req.json();

		if (!email || !password) {
			return new Response(
				JSON.stringify({ error: '이메일과 비밀번호를 입력해주세요.' }),
				{
					status: 400,
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

		// RPC 함수로 비밀번호 검증 및 사용자 정보 조회
		const { data: user, error } = await supabase.rpc('admin_login', {
			p_email: email,
			p_password: password,
		});

		if (error || !user) {
			return new Response(
				JSON.stringify({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// JWT Secret 가져오기 (Supabase의 JWT Secret 사용)
		const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET') ?? '';
		if (!jwtSecret) {
			throw new Error('JWT Secret이 설정되지 않았습니다.');
		}

		// JWT 토큰 생성 (7일 유효)
		const secret = new TextEncoder().encode(jwtSecret);
		const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7일

		const token = await new SignJWT({
			sub: user.id,
			email: user.email,
			role: 'admin',
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime(exp)
			.sign(secret);

		// 토큰과 사용자 정보 반환
		return new Response(
			JSON.stringify({
				token,
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
					name: user.name,
					is_active: user.is_active,
				},
			}),
			{
				status: 200,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('[Admin Login Error]', error);
		return new Response(
			JSON.stringify({ error: error.message || '로그인에 실패했습니다.' }),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});

