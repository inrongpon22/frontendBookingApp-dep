export interface shopDetailTypes {
  id: string | number;
  title: string;
  address: string;
  description: string;
  imagesURL: string[];
  latitude: string | number;
  longitude: string | number;
  phoneNumber: string;
  userId: string;
  created_at: string;
}

export interface serviceTypes {
  id: string;
  title: string;
  bookInAdvanceDays: number;
  businessId: string;
  capacity: number;
  closeTime: string;
  created_at: string;
  currency: string;
  daysOpen: string[];
  description: string;
  duration: number;
  isSelected: true;
  openTime: string;
  price: number;
  requireApproval: boolean;
  specialOpenDate: { openDate: string; isRepeat: boolean }[];
  specialOpenTime: {
    capacity: number;
    closeTime: string;
    duration: number;
    isRepeat: boolean;
    openTime: string;
  }[];
}

export interface quantityTypes {
  title: string;
  desc?: string;
  additionalNotes?: string;
  quantities: number;
  max: number;
  min: number;
}

export interface openTimeTypes {
  label: string;
  isAvailiable: boolean;
  isSelected: boolean;
}