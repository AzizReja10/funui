import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Carousel.css";

const springTransition = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

export const Carousel = ({
  items = [],
  initialIndex = 0,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  showProgress = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!items || items.length === 0) return 0;
    return Math.min(Math.max(0, initialIndex), items.length - 1);
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const total = items.length;

  const goToSlide = useCallback(
    (index) => {
      if (total === 0) return;
      setCurrentIndex((index + total) % total);
    },
    [total]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay timer
  useEffect(() => {
    if (!autoPlay || isPaused || isDragging || total <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, isPaused, isDragging, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(total - 1);
      }
    };

    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, goToSlide, total]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`carousel ${isDragging ? "carousel--dragging" : ""} ${isPaused ? "carousel--paused" : ""
        } ${className}`}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image coverflow carousel. Use arrow keys to navigate."
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Viewport with Framer Motion drag gestures */}
      <motion.div
        className="carousel__viewport"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          const threshold = 40;
          const velocityThreshold = 400;
          if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            nextSlide();
          } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            prevSlide();
          }
        }}
      >
        {items.map((item, index) => {
          // Circular shortest-distance offset
          let offset = index - currentIndex;
          if (total > 3) {
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
          }

          const isActive = offset === 0;
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 2;

          // 3D Coverflow positioning
          const x = `${offset * 58}%`;
          const scale = isActive ? 1 : Math.max(0.68, 0.85 - (absOffset - 1) * 0.14);
          const rotateY = offset * -25;
          const z = isActive ? 40 : -absOffset * 85;
          const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.32;
          const filter = isActive
            ? "brightness(1) contrast(1)"
            : `brightness(${Math.max(0.35, 0.65 - (absOffset - 1) * 0.2)}) contrast(0.95)`;
          const zIndex = 20 - absOffset;

          return (
            <motion.div
              key={item.id ?? index}
              className={`carousel__slide ${isActive ? "carousel__slide--active" : "carousel__slide--inactive"
                }`}
              style={{
                zIndex,
                pointerEvents: isVisible ? "auto" : "none",
                cursor: isActive ? "grab" : "pointer",
              }}
              initial={false}
              animate={{
                x,
                scale,
                rotateY,
                z,
                opacity,
                filter,
              }}
              whileHover={
                !isActive && isVisible
                  ? {
                    scale: scale * 1.03,
                    filter: "brightness(0.85) contrast(1)",
                  }
                  : undefined
              }
              transition={springTransition}
              onClick={() => {
                if (!isActive) goToSlide(index);
              }}
              aria-hidden={!isActive}
            >
              <img
                src={item.image}
                alt={item.title || "Slide"}
                className="carousel__image"
                draggable={false}
              />

              <div className="carousel__overlay">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key={`content-${item.id ?? index}`}
                      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="carousel__overlay-content"
                    >
                      {item.badge && (
                        <span className="carousel__badge">{item.badge}</span>
                      )}
                      <h2 className="carousel__title">{item.title}</h2>
                      <p className="carousel__description">{item.description}</p>
                    </motion.div>
                  ) : (
                    <div className="carousel__overlay-content carousel__overlay-content--inactive">
                      <h2 className="carousel__title">{item.title}</h2>
                      <p className="carousel__description">{item.description}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      {showControls && total > 1 && (
        <>
          <motion.button
            type="button"
            className="carousel__nav carousel__nav--prev"
            style={{ transformOrigin: "center center" }}
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(30, 41, 59, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.45)",
            }}
            whileTap={{ scale: 0.92 }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </motion.button>

          <motion.button
            type="button"
            className="carousel__nav carousel__nav--next"
            style={{ transformOrigin: "center center" }}
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(30, 41, 59, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.45)",
            }}
            whileTap={{ scale: 0.92 }}
            aria-label="Next slide"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </motion.button>
        </>
      )}

      {/* Floating Pill Indicators */}
      {showIndicators && total > 1 && (
        <div
          className="carousel__dots"
          role="tablist"
          aria-label="Slide navigation"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((_, index) => {
            const isDotActive = index === currentIndex;
            return (
              <motion.button
                key={index}
                layout
                type="button"
                role="tab"
                aria-selected={isDotActive}
                aria-label={`Go to slide ${index + 1}`}
                className="carousel__dot-btn"
                onClick={() => goToSlide(index)}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              >
                {isDotActive ? (
                  <motion.div
                    layoutId="carouselActiveDot"
                    className="carousel__dot carousel__dot--active"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                ) : (
                  <motion.div
                    className="carousel__dot carousel__dot--inactive"
                    whileHover={{
                      scale: 1.25,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Auto-play Progress Bar */}
      {showProgress && autoPlay && total > 1 && (
        <div className="carousel__progress">
          <div
            key={`${currentIndex}-${isPaused ? "paused" : "running"}`}
            className="carousel__progress-bar"
            style={{
              animationDuration: `${interval}ms`,
              animationPlayState: isPaused || isDragging ? "paused" : "running",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;
