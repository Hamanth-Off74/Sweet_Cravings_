import { cn } from "@/utils/cn";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export const HeaderDock = ({
  items,
  className,
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("header-dock", className)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  badge,
  onClick
}) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 48, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 48, 40]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="icon-container relative"
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: -10, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="tooltip"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '5px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 100
            }}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="icon-wrapper flex items-center justify-center w-full h-full text-gray-600 dark:text-gray-200" style={{ width: '65%', height: '65%' }}>
        {icon}
      </div>
      {badge !== undefined && badge !== null && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-800"
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ff4d4d',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid white'
          }}
        >
          {badge}
        </span>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </Link>
    );
  }

  return content;
}
