import React, { useRef, useState } from 'react';
import { Button } from '@repo/ui';
import { Image, Upload, X } from 'lucide-react';
import { storageService } from '@/shared/api/services/storage.service';
import { ImageUploadProps } from '../types';

export function ImageUpload({ imageUrl, onUpdateImage, desc, label = '이미지' }: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = async (file: File) => {
		try {
			setUploading(true);

			// 파일 유효성 검사
			const validation = storageService.validateImageFile(file);
			if (!validation.isValid) {
				alert(validation.error);
				return;
			}

			// 이미지 업로드
			const result = await storageService.uploadImage(file, 'test-thumbnails');
			onUpdateImage(result.url);
		} catch (error) {
			console.error('이미지 업로드 실패:', error);

			// RLS 정책 에러인 경우 특별한 안내 메시지
			if (error instanceof Error && error.message.includes('row-level security policy')) {
				alert(
					'이미지 업로드를 위해 Supabase Storage RLS 정책 설정이 필요합니다.\n\n' +
						'Supabase 대시보드에서 다음 SQL을 실행해주세요:\n\n' +
						'1. Authentication > Policies > storage.objects\n' +
						'2. 다음 정책들을 추가:\n\n' +
						'CREATE POLICY "Public Access" ON storage.objects\n' +
						"FOR SELECT USING (bucket_id = 'images');\n\n" +
						'CREATE POLICY "Authenticated users can upload" ON storage.objects\n' +
						"FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');\n\n" +
						'CREATE POLICY "Authenticated users can delete" ON storage.objects\n' +
						"FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');\n\n" +
						'설정 완료 후 다시 시도해주세요.'
				);
			} else if (error instanceof Error && error.message.includes('Bucket not found')) {
				alert(
					'이미지 업로드를 위해 Supabase Storage 설정이 필요합니다.\n\n' +
						'Supabase 대시보드에서 다음 단계를 진행해주세요:\n\n' +
						'1. Storage > Buckets로 이동\n' +
						'2. "Create a new bucket" 클릭\n' +
						'3. Name: images, Public: 체크\n' +
						'4. File size limit: 5MB 설정\n' +
						'5. Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp\n\n' +
						'설정 완료 후 다시 시도해주세요.'
				);
			} else {
				alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
			}
		} finally {
			setUploading(false);
		}
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleImageUpload(file);
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageRemove = async () => {
		try {
			// 기존 이미지가 Supabase URL인 경우 삭제
			if (imageUrl?.includes('supabase')) {
				const url = new URL(imageUrl);
				const pathParts = url.pathname.split('/');
				const bucket = pathParts[2];
				const filePath = pathParts.slice(3).join('/');

				if (bucket === 'images') {
					await storageService.deleteImage(filePath);
				}
			}

			onUpdateImage('');
		} catch (error) {
			console.error('이미지 삭제 실패:', error);
			// 삭제 실패해도 UI에서는 제거
			onUpdateImage('');
		}
	};

	return (
		<div>
			<label className="text-base font-medium block">{label}</label>
			<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
				{imageUrl ? (
					<div className="relative">
						<img src={imageUrl} alt={label} className="w-full h-40 object-cover rounded" />
						<Button
							onClick={handleImageRemove}
							variant="destructive"
							size="sm"
							className="absolute top-2 right-2"
							disabled={uploading}
						>
							<X className="w-4 h-4" />
						</Button>
					</div>
				) : (
					<div className="text-gray-500">
						<Image className="w-16 h-16 mx-auto mb-4" />
						<p className="text-lg font-medium">{label}을 추가하세요</p>
						{desc && <p className="text-sm">{desc}</p>}
					</div>
				)}
			</div>
			<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
			<Button variant="outline" className="w-full mt-3" onClick={handleUploadClick} loading={uploading} loadingText="업로드 중...">
				<Upload className="w-4 h-4 mr-2" />
				직접 업로드
			</Button>
		</div>
	);
}

// ThumbnailUpload는 ImageUpload의 래퍼 컴포넌트
export const ThumbnailUpload = ({
	thumbnailUrl,
	onUpdateThumbnail,
}: {
	thumbnailUrl: string;
	onUpdateThumbnail: (url: string) => void;
}) => {
	return (
		<ImageUpload
			imageUrl={thumbnailUrl}
			onUpdateImage={onUpdateThumbnail}
			label="썸네일"
			desc="테스트 대표 이미지를 업로드하세요 (SNS 공유시 표시됩니다)"
		/>
	);
};
