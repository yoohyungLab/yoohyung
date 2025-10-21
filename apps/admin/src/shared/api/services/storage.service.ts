import { supabase } from '@pickid/supabase';

export interface UploadResult {
	url: string;
	path: string;
}

export const storageService = {
	async uploadImage(file: File, folder: string = 'test-thumbnails'): Promise<UploadResult> {
		try {
			// 파일명 생성 (타임스탬프 + 랜덤 문자열)
			const timestamp = Date.now();
			const randomString = Math.random().toString(36).substring(2, 15);
			const fileExtension = file.name.split('.').pop();
			const fileName = `${timestamp}-${randomString}.${fileExtension}`;
			const filePath = `${folder}/${fileName}`;

			// Supabase Storage에 업로드
			const { error } = await supabase.storage.from('images').upload(filePath, file, {
				cacheControl: '3600',
				upsert: false,
			});

			if (error) {
				throw new Error(`이미지 업로드 실패: ${error.message}`);
			}

			// 공개 URL 생성
			const {
				data: { publicUrl },
			} = supabase.storage.from('images').getPublicUrl(filePath);

			return {
				url: publicUrl,
				path: filePath,
			};
		} catch (error) {
			console.error('이미지 업로드 에러:', error);
			throw error;
		}
	},

	async deleteImage(path: string): Promise<void> {
		try {
			const { error } = await supabase.storage.from('images').remove([path]);

			if (error) {
				throw new Error(`이미지 삭제 실패: ${error.message}`);
			}
		} catch (error) {
			console.error('이미지 삭제 에러:', error);
			throw error;
		}
	},

	// 파일 유효성 검사
	validateImageFile(file: File): { isValid: boolean; error?: string } {
		const maxSize = 5 * 1024 * 1024; // 5MB
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

		if (file.size > maxSize) {
			return { isValid: false, error: '파일 크기는 5MB를 초과할 수 없습니다.' };
		}

		if (!allowedTypes.includes(file.type)) {
			return {
				isValid: false,
				error: '지원되는 파일 형식: JPEG, PNG, GIF, WebP',
			};
		}

		return { isValid: true };
	},
};
