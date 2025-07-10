import React, { useState, useEffect } from 'react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1603049405392-74dc211f2ba6?w=800&h=400&fit=crop',
      title: 'Fresh Meat Delivered',
      subtitle: 'Premium quality meat at your doorstep'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=400&fit=crop',
      title: 'Special Offers',
      subtitle: 'Up to 30% off on selected items'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1603049405392-74dc211f2ba6?w=800&h=400&fit=crop',
      title: 'Organic & Fresh',
      subtitle: 'Farm to table freshness guaranteed'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative h-48 md:h-64 overflow-hidden rounded-lg mb-6">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-1">{banner.title}</h2>
            <p className="text-sm md:text-base opacity-90">{banner.subtitle}</p>
          </div>
        </div>
      ))}
      
      {/* Dots indicator */}
      <div className="absolute bottom-2 right-4 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner; 