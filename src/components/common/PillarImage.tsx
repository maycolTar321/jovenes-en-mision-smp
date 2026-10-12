import React, { useState } from 'react';
import { Sprout, HeartHandshake, Sparkles, Image as ImageIcon } from 'lucide-react';

interface PillarImageProps {
  src: string;
  alt: string;
  pillarNumber: number;
  pillarTitle: string;
  color: string;
  className?: string;
}

export const PillarImage: React.FC<PillarImageProps> = ({
  src,
  alt,
  pillarNumber,
  pillarTitle,
  color,
  className = "h-56 sm:h-64"
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getFallbackIcon = () => {
    switch (pillarNumber) {
      case 1:
        return <Sprout className="w-12 h-12 text-[#214C3B]" />;
      case 2:
        return <HeartHandshake className="w-12 h-12 text-[#214C3B]" />;
      case 3:
        return <Sparkles className="w-12 h-12 text-[#214C3B]" />;
      default:
        return <ImageIcon className="w-12 h-12 text-stone-500" />;
    }
  };

  const getGradient = () => {
    return 'from-neutral-950/85 via-neutral-900/40 to-transparent';
  };

  if (hasError) {
    return (
      <div className={`w-full ${className} rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shadow-inner`}>
        <div className="p-4 rounded-full bg-white shadow-sm mb-3">
          {getFallbackIcon()}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
          PILAR {pillarNumber} • {pillarTitle}
        </span>
        <span className="text-[11px] text-stone-500 mt-1 max-w-xs">
          Fotografía de campo pastoral: Acción comunitaria en Tarija
        </span>
        <span className="text-[10px] text-stone-400 mt-2 px-2 py-0.5 rounded bg-white/80 border border-stone-200">
          Identificador fotográfico oficial
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className} overflow-hidden rounded-2xl bg-stone-100 group`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-stone-400 animate-bounce" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Gradiente protector de legibilidad */}
      <div className={`absolute inset-0 bg-gradient-to-t ${getGradient()} opacity-75 pointer-events-none`} />

      {/* Badge sobre la foto */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/95 text-stone-900 backdrop-blur-md shadow-md border border-white/50">
          <span className="w-2 h-2 rounded-full bg-[#214C3B] animate-ping inline-block" />
          Pilar {pillarNumber}
        </span>
      </div>
    </div>
  );
};
