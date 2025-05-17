
import React, { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Use relative path from this file to access the assets
const AppMockupCarousel = () => {
  // Define hardcoded image URLs for now since we can't access the uploaded files directly
  const appImages = [
    '/lovable-uploads/mock-dashboard.png', 
    '/lovable-uploads/mock-financeiro.png'
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % appImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[320px] mx-auto">
      <AspectRatio ratio={9/16} className="bg-muted rounded-xl overflow-hidden border shadow-lg relative">
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/30">
          {appImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`ProAgenda app screenshot ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </AspectRatio>
    </div>
  );
};

export default AppMockupCarousel;
