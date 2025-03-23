import { FC, useMemo } from "react";
import styles from "./carousel.module.css";
import useCarouselContext from "./hooks/useCarouselContext";

interface CarouselIndicatorProps {
  className?: string;
  activeColor?: string;
  defaultColor?: string;
}

const CarouselIndicator: FC<CarouselIndicatorProps> = ({
  className,
  activeColor,
  defaultColor,
}) => {
  const { carouselIndex, setCarouselIndex, itemLength } = useCarouselContext();

  const indexes = useMemo(
    () => Array.from({ length: itemLength }, (_, index) => index),
    [itemLength]
  );

  const carouselIndicatorCls = useMemo(() => {
    return `${styles.carouselIndicator} ${className || ""}`.trim();
  }, [className]);

  return (
    <div className={carouselIndicatorCls}>
      {indexes.map((index) => (
        <button
          aria-label={`carousel ${index + 1} 이동 버튼`}
          key={index}
          className={index === carouselIndex ? styles.active : ""}
          style={{
            backgroundColor:
              index === carouselIndex ? activeColor : defaultColor,
          }}
          onClick={() => setCarouselIndex(index)}
        />
      ))}
    </div>
  );
};

export default CarouselIndicator;
