import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="px-4 py-6">
                {/* 로고 및 설명 */}
                <div className="flex items-center mb-10">
                    <img src="/icons/logo.svg" alt="로고" className="w-10 h-10 mr-2" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">유형연구소</h3>
                        <p className="text-sm text-gray-600">나는 누구일까? 알아보는 재미!</p>
                    </div>
                </div>

                {/* 테스트 링크 */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">다른 테스트도 궁금하다면?</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <a href="/tests/egen-teto" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
                            에겐·테토 테스트
                        </a>
                        <a href="/tests/mbti" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
                            MBTI 테스트
                        </a>
                        <a href="/tests/enneagram" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
                            에니어그램
                        </a>
                        <a href="/tests/iq" className="text-sm text-gray-600 hover:text-pink-500 py-1 transition-colors">
                            IQ 퀴즈
                        </a>
                    </div>
                </div>

                {/* 저작권 */}
                <div className="border-t border-gray-200 pt-4 text-center">
                    <p className="text-xs text-gray-500">© 2024 유형연구소. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
