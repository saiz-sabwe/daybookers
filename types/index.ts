export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  stars: number;
  rating: number;
  reviewCount: number;
  minPrice: number;
  originalPrice?: number;
  currency?: string;
  images: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  partnerId?: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
}

export interface Booking {
  id: string;
  hotelId: string;
  userId: string;
  date: string | Date;
  timeSlot: {
    id: string;
    startTime: string;
    endTime: string;
  };
  guestCount: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string | Date;
  updatedAt: string | Date;
}

