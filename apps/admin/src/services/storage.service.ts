import { supabase } from '@pickid/supabase';
import type { UploadResult } from '@/types/storage.types';

export const storageService = {
	async uploadImage(file: File, folder: string = 'test-thumbnails'): Promise<UploadResult> {
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 15);
		const fileExtension = file.name.split('.').pop();
		const fileName = `${timestamp}-${randomString}.${fileExtension}`;
		const filePath = `${folder}/${fileName}`;

		const { error } = await supabase.storage.from('images').upload(filePath, file, {
			cacheControl: '3600',
			upsert: false,
		});

		if (error) {
			throw new Error(`이미지 업로드 실패: ${error.message}`);
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from('images').getPublicUrl(filePath);

		return {
			url: publicUrl,
			path: filePath,
		};
	},

	async deleteImage(path: string): Promise<void> {
		const { error } = await supabase.storage.from('images').remove([path]);

		if (error) {
			throw new Error(`이미지 삭제 실패: ${error.message}`);
		}
	},

	validateImageFile(file: File): { isValid: boolean; error?: string } {
		const maxSize = 5 * 1024 * 1024;
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
