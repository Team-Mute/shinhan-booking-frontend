// import { SpaceUpdateRequest } from "@admin/types/space";

// export function makeDefaultOperations() {
//   return [
//     { day: "월", start: "", end: "", closed: false },
//     { day: "화", start: "", end: "", closed: false },
//     { day: "수", start: "", end: "", closed: false },
//     { day: "목", start: "", end: "", closed: false },
//     { day: "금", start: "", end: "", closed: false },
//     { day: "토", start: "", end: "", closed: false },
//     { day: "일", start: "", end: "", closed: false },
//   ];
// }

// export function makeInitialFormData(
//   initialData?: Partial<SpaceUpdateRequest>
// ): SpaceUpdateRequest {
//   return {
//     space: {
//       spaceName: initialData?.space?.spaceName ?? "",
//       spaceDescription: initialData?.space?.spaceDescription ?? "",
//       spaceCapacity: initialData?.space?.spaceCapacity ?? 0,
//       spaceIsAvailable: initialData?.space?.spaceIsAvailable ?? true,
//       regionId: initialData?.space?.regionId ?? 0,
//       categoryId: initialData?.space?.categoryId ?? 0,
//       locationId: initialData?.space?.locationId ?? 0,
//       tagNames: initialData?.space?.tagNames ?? [],
//       adminName: initialData?.space?.adminName ?? "",
//       reservationWay: initialData?.space?.reservationWay ?? "",
//       spaceRules: initialData?.space?.spaceRules ?? "",
//       operations: initialData?.space?.operations ?? [
//         { day: 1, from: "09:00", to: "18:00", isOpen: true },
//         { day: 2, from: "09:00", to: "18:00", isOpen: true },
//         { day: 3, from: "09:00", to: "18:00", isOpen: true },
//         { day: 4, from: "09:00", to: "18:00", isOpen: true },
//         { day: 5, from: "09:00", to: "18:00", isOpen: true },
//         { day: 6, from: "00:00", to: "00:00", isOpen: false },
//         { day: 7, from: "00:00", to: "00:00", isOpen: false },
//       ],
//       closedDays: initialData?.space?.closedDays ?? [],
//     },
//     images: initialData?.images ?? [],
//     keepUrlsOrder: initialData?.keepUrlsOrder ?? [],
//   };
// }

// export function updateSpace(form: any, key: string, value: any) {
//   return { ...form, [key]: value };
// }

export const marginRight = "3.4rem";
