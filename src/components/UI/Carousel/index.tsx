import {
  createContext,
  FC,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useRef,
  useMemo,
  TouchEvent,
  useEffect,
} from "react";
import CarouselItemList from "./CarouselItemList";
import CarouselItem from "./CarouselItem";
import CarouselNavigator from "./CarouselNavigator";
import CarouselIndicator from "./CarouselIndicator";
import styles from "./carousel.module.css";

interface CarouselProps {
  children?: ReactNode;
  className?: string;
}

interface CarouselCompoundProps {
  ItemList: typeof CarouselItemList;
  Item: typeof CarouselItem;
  Navigator: typeof CarouselNavigator;
  Indicator: typeof CarouselIndicator;
}

interface CarouselContextProps {
  carouselIndex: number;
  setCarouselIndex: Dispatch<SetStateAction<number>>;
  itemLength: number;
  setItemLength: Dispatch<SetStateAction<number>>;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

const Carousel: FC<CarouselProps> & CarouselCompoundProps = ({
  children,
  className,
}) => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [itemLength, setItemLength] = useState<number>(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // 스와이프 인식 최소 거리

  // 터치 시작
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  // 터치 이동 중
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // 터치 종료
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const swipeDistance = touchStartX.current - touchEndX.current;

    if (swipeDistance > SWIPE_THRESHOLD) {
      // 왼쪽 → 오른쪽 스와이프 (다음 슬라이드)
      setCarouselIndex((prevIndex) =>
        prevIndex === itemLength - 1 ? 0 : prevIndex + 1
      );
    } else if (swipeDistance < -SWIPE_THRESHOLD) {
      // 오른쪽 → 왼쪽 스와이프 (이전 슬라이드)
      setCarouselIndex((prevIndex) =>
        prevIndex === 0 ? itemLength - 1 : prevIndex - 1
      );
    }

    // 터치 값 초기화
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const contextValue = {
    carouselIndex,
    setCarouselIndex,
    itemLength,
    setItemLength,
  };

  useEffect(() => {
    setCarouselIndex(0);
  }, [itemLength]);

  const carouselCls = useMemo(() => {
    return `${styles.carouselContainer} ${className || ""}`.trim();
  }, [className]);

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        className={carouselCls}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

Carousel.ItemList = CarouselItemList;
Carousel.Item = CarouselItem;
Carousel.Navigator = CarouselNavigator;
Carousel.Indicator = CarouselIndicator;

export default Carousel;
export { CarouselContext };
