'use client';

import { useState, useEffect } from 'react';

const Carrusel = () => {
    const slides = [
        {
            image: "/carrusel3.png",
            title: "Cuidamos de tu Salud con Excelencia",
            subtitle: "Tecnología de vanguardia y profesionales dedicados para ti y tu familia."
        },
        {
            image: "/carrusel4.png",
            title: "Turnos Médicos en Línea",
            subtitle: "Gestiona tus citas médicas de forma simple, rápida y desde tu hogar."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        <div className="relative w-full bg-slate-900 overflow-hidden shadow-lg group">
            {/* Slides container */}
            <div className="relative h-[calc(100vh-64px)] min-h-[500px] w-full">
                {slides.map((slide, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-slate-950/40 z-10"></div>
                            
                            <img
                                src={slide.image}
                                className="w-full h-full object-cover"
                                alt={slide.title}
                            />
                            
                            <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                                <div className="text-center max-w-3xl space-y-4">
                                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                                        {slide.title}
                                    </h2>
                                    <p className="text-base md:text-xl text-sky-100 drop-shadow-md font-medium">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Indicator Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2.5 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? "bg-sky-500 w-8"
                                : "bg-white/50 hover:bg-white"
                        }`}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Left Control */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/30 text-white hover:bg-sky-600 transition opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Slide anterior"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Control */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/30 text-white hover:bg-sky-600 transition opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Siguiente slide"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Carrusel;
