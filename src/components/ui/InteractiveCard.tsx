import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  tiltEffect?: boolean;
  magneticEffect?: boolean;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  glowEffect = false,
  tiltEffect = false,
  magneticEffect = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setMousePosition({ x: rotateX, y: rotateY });

    if (magneticEffect) {
      const magneticX = (x - centerX) * 0.1;
      const magneticY = (y - centerY) * 0.1;
      cardRef.current.style.transform = `translate(${magneticX}px, ${magneticY}px)`;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
    if (cardRef.current && magneticEffect) {
      cardRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  const cardVariants = {
    initial: { scale: 1, rotateX: 0, rotateY: 0 },
    hover: {
      scale: 1.05,
      rotateX: tiltEffect ? mousePosition.x : 0,
      rotateY: tiltEffect ? mousePosition.y : 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        ${className}
        ${glowEffect ? 'glow-effect' : ''}
        ${tiltEffect ? 'tilt-effect' : ''}
        transition-all duration-300 cursor-pointer
      `}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

export default InteractiveCard;