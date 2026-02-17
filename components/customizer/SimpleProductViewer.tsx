/**
 * Simple Product Viewer Component
 * Displays product templates (front/back) with user design overlay
 * No external API dependencies - pure local rendering
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductViewConfig {
    designX: number;
    designY: number;
    designWidth: number;
    designHeight: number;
    designRotation: number;
}

interface SimpleProductViewerProps {
    frontTemplateUrl: string; // e.g., '/products/tshirt-front.png'
    backTemplateUrl: string;  // e.g., '/products/tshirt-back.png'
    userDesignUrl: string | null; // Data URL or uploaded image
    designConfig: ProductViewConfig;
    productName?: string;
    className?: string;
}

export function SimpleProductViewer({
    frontTemplateUrl,
    backTemplateUrl,
    userDesignUrl,
    designConfig,
    productName = 'Produit',
    className = '',
}: SimpleProductViewerProps) {
    const [currentView, setCurrentView] = useState<'front' | 'back'>('front');

    const templateUrl = currentView === 'front' ? frontTemplateUrl : backTemplateUrl;

    return (
        <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 ${className}`}>
            {/* Template Container */}
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
                {/* Base Template Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={templateUrl}
                        alt={`${productName} - ${currentView === 'front' ? 'Recto' : 'Verso'}`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* User Design Overlay */}
                {userDesignUrl && (
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            left: `${designConfig.designX}px`,
                            top: `${designConfig.designY}px`,
                            width: `${designConfig.designWidth}px`,
                            height: `${designConfig.designHeight}px`,
                            transform: `rotate(${designConfig.designRotation}deg)`,
                            transformOrigin: 'center',
                        }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={userDesignUrl}
                                alt="Votre design"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* View Toggle - Front/Back */}
            <div className="flex items-center justify-center gap-4 mt-6">
                <button
                    onClick={() => setCurrentView('front')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${currentView === 'front'
                            ? 'bg-primary-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Recto
                </button>

                <div className="w-px h-8 bg-gray-300" />

                <button
                    onClick={() => setCurrentView('back')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${currentView === 'back'
                            ? 'bg-primary-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Verso
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* View Indicator */}
            <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                    {currentView === 'front' ? '👕 Vue de face' : '👔 Vue de dos'}
                </p>
            </div>

            {/* No Design Message */}
            {!userDesignUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg">
                        <p className="text-gray-600 font-medium">
                            Uploadez un design pour le visualiser
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
