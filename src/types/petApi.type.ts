export type MedicalType = "hospital" | "pharmacy";

export interface MedicalService {
  name: string;
  lat: number | null;
  lng: number | null;
  businessState?: string;
  phone?: string | null;
  roadAddress: string;
  lotAddress: string;
}

export interface FuneralService {
  title: string;
  lat: number;
  lng: number;
  phone?: string;
  zipCode?: string;
  roadAddress?: string;
  lotAddress?: string;
}

export interface PlaceInfo {
  id: string;
  title: string;
  address: string;
  homepage?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  tel?: string;
  name?: string;
  subImageUrl?: string;
}

export interface FoodService {
  id: string;
  name: string;
  category: string;
  origin: string;
  price: string;
  protein: string;
  fat: string;
  fiber: string;
  moisture: string;
  dryMatter: string; // 건물(%)
  tryptophan: string; // 트립토판(%)
  calcium: string; // 칼슘(%)
  phosphorus: string; // 인(%)
  linoleicAcid: string; // 리놀레산(%)
  linolenicAcid: string; // 레놀렌산(%)
  ash: string; // 회분(%)
  vitaminA: string; // 비타민 A (RE/100g)
  carbohydrates: string; // 탄수화물(%)
  totalDietaryFiber: string; // 총 식이섬유(%)
  insolubleFiber: string; // 불용성 식이섬유(%)
  solubleFiber: string; // 수용성 식이섬유(%)
  sodium: string; // 나트륨(%)
  potassium: string; // 칼륨(%)
}

export interface WalkData {
  user: number;
  pet: string;
  petName?: string;
  userProfileImage?: string;
  petImage?: string;
  startTime: string | Date;
  startLocation: {
    address: string;
    buildingName: string;
    lat: number;
    lng: number;
  };
  endTime: string | Date;
  endLocation: {
    address: string;
    buildingName: string;
    lat: number;
    lng: number;
  };
  duration?: string;
}
