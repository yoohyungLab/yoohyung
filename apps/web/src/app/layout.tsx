import { Footer } from '@/widgets';
import Sidebar from '@/widgets/sidebar';
import type { Metadata } from 'next';
import { Gowun_Dodum } from 'next/font/google';
import './globals.css';

const gowunDodum = Gowun_Dodum({
    subsets: ['latin'],
    weight: '400',
    display: 'swap',
    variable: '--font-gowun-dodum',
});

export const metadata: Metadata = {
    title: 'TypologyLab - 심리테스트 플랫폼',
    description: '나만의 성향을 알아보는 재미있는 심리테스트를 만나보세요. 에겐·테토 테스트부터 다양한 성격 분석까지.',
    keywords: ['심리테스트', '성격분석', '에겐테토', 'MBTI', '자기계발'],
    authors: [{ name: 'TypologyLab' }],
    creator: 'TypologyLab',
    publisher: 'TypologyLab',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://typologylab.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: 'https://typologylab.com',
        title: 'TypologyLab - 심리테스트 플랫폼',
        description: '나만의 성향을 알아보는 재미있는 심리테스트를 만나보세요.',
        siteName: 'TypologyLab',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TypologyLab - 심리테스트 플랫폼',
        description: '나만의 성향을 알아보는 재미있는 심리테스트를 만나보세요.',
        creator: '@typologylab',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className={gowunDodum.className}>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <div className="w-full max-w-mobile mx-auto bg-white shadow-2xl">
                        <Sidebar />
                        <main className="flex-1 p-4 min-h-screen">{children}</main>
                        <Footer />
                    </div>

                    {/* 애드센스 광고 영역 - 데스크톱에서만 표시 */}
                    {/* <div className="hidden lg:block fixed top-0 left-0 w-48 h-full bg-gray-100 border-r border-gray-200">
              <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">광고 영역</div>
                  <div className="w-full h-96 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">좌측 광고</span>
                  </div>
              </div>
          </div> */}

                    {/* <div className="hidden lg:block fixed top-0 right-0 w-48 h-full bg-gray-100 border-l border-gray-200">
              <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">광고 영역</div>
                  <div className="w-full h-96 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">우측 광고</span>
                  </div>
              </div>
          </div> */}

                    {/* 하단 광고 영역 */}
                    {/* <div className="hidden md:block fixed bottom-0 left-0 right-0 h-20 bg-gray-100 border-t border-gray-200">
              <div className="max-w-mobile mx-auto h-full flex items-center justify-center">
                  <span className="text-gray-400">하단 광고</span>
              </div>
          </div> */}
                </div>
            </body>
        </html>
    );
}
