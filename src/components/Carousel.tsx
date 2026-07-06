import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Material } from '../types';

interface CarouselProps {
  materials: Material[];
  purchaseUrl: string;
}

export default function Carousel({ materials, purchaseUrl }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === Math.ceil(materials.length / 2) - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, materials]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.ceil(materials.length / 2) - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === Math.ceil(materials.length / 2) - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative group max-w-7xl mx-auto px-4 select-none">
      
      {/* Cards Container */}
      <div className="overflow-hidden rounded-3xl p-2">
        <div 
          className="flex transition-transform duration-700 ease-out gap-6"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {materials.map((material) => (
            <div 
              key={material.id}
              className="w-full md:w-[calc(50%-12px)] shrink-0 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image and badges */}
                <div className="relative rounded-2xl overflow-hidden h-60 md:h-64 bg-slate-50 border border-slate-100">
                  <img 
                    src={material.image} 
                    alt={material.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {material.disciplineName}
                  </span>

                  {material.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-slate-900 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Mais Vendido
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{material.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-xs">({material.reviewsCount} avaliações)</span>
                </div>

                {/* Content */}
                <h4 className="font-display font-extrabold text-slate-900 text-lg md:text-xl leading-tight mt-2 line-clamp-1 hover:text-blue-600 transition-colors">
                  {material.title}
                </h4>
                
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {material.description}
                </p>

                <div className="flex items-center gap-4 mt-3 pb-3 border-b border-slate-50 text-[11px] text-slate-500 font-semibold">
                  <span>📄 {material.pages} Páginas</span>
                  <span>⚙️ {material.fileFormat}</span>
                </div>
              </div>

              {/* Purchase Footer */}
              <div className="flex items-center justify-between pt-4 mt-auto">
                <div>
                  <span className="text-slate-400 text-xs line-through">De R$ {material.originalPrice.toFixed(2)}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-red-600 font-display font-black text-2xl">R$ {material.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pix</span>
                  </div>
                </div>

                <a
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-blue-500/15 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Comprar
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Navigation Chevrons */}
      <button 
        onClick={prevSlide}
        className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-full shadow-lg border border-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 z-10"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-full shadow-lg border border-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 z-10"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(Math.ceil(materials.length / 2))].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === i ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
