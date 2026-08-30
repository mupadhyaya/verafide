export interface Swipe {
  id: string;
  swiperId: string;
  swipeeId: string;
  direction: "like" | "pass";
  createdAt: string;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: string;
  unmatchedAt: string | null;
}
