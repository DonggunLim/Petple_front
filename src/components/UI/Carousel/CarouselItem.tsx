import { FC, ReactNode, useMemo } from "react";
import styles from "./carousel.module.css";
import useCarouselContext from "./hooks/useCarouselContext";

interface CarouselItemProps {
  index: number;
  children: ReactNode;
  className?: string;
}

const CarouselItem: FC<CarouselItemProps> = ({
  children,
  index,
  className,
}) => {
  const { carouselIndex } = useCarouselContext();

  const carouselItemCls = useMemo(() => {
    return `${styles.carouselItem} ${className || ""}`.trim();
  }, [className]);
  if (carouselIndex !== index) {
    return null;
  }

  return <div className={carouselItemCls}>{children}</div>;
};

export default CarouselItem;
