export type AdminReview = { id: string; name: string; caregiver: string; title: string; message: string; rating: number; status: "Pending" | "Published" | "Hidden" };
export const initialAdminReviews: AdminReview[] = [
  { id: "linda-marek", name: "Linda Moore", caregiver: "Marek Nowak", title: "Attentive and caring", message: "Very caring and attentive. Communication could be a touch quicker.", rating: 4, status: "Pending" },
  { id: "aisha-priya", name: "Aisha Rahman", caregiver: "Priya Sharma", title: "Fast recovery", message: "Knowledgeable and warm. Helped me and my aunt recover quickly after her hip surgery.", rating: 5, status: "Pending" },
  { id: "john-daniel", name: "John Smith", caregiver: "Daniel Hughes", title: "Reliable and thoughtful", message: "Daniel always arrives on time and makes my father feel comfortable.", rating: 5, status: "Published" },
  { id: "helen-grace", name: "Helen Carter", caregiver: "Grace Okafor", title: "Wonderful support", message: "Kind, professional care and regular updates for our family.", rating: 5, status: "Published" },
  { id: "emma-sarah", name: "Emma Wilson", caregiver: "Sarah Mitchell", title: "A real help", message: "Patient and reassuring throughout our first week of care.", rating: 4, status: "Published" },
  { id: "robert-tom", name: "Robert Evans", caregiver: "Tom Richards", title: "Visit feedback", message: "We had difficulty agreeing on the schedule for our visit.", rating: 2, status: "Hidden" },
];
