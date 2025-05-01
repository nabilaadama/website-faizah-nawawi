// export interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | null;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
