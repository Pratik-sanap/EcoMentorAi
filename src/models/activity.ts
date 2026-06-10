/* src/models/activity.ts */
export enum ActivityType {
  Transport = 'Transport',
  Food = 'Food',
  Energy = 'Energy',
  Waste = 'Waste',
  Shopping = 'Shopping',
}

/** Specific transport modes within the Transport category */
export type TransportMode = "Car" | "Bus" | "Train" | "Bike" | "Walking";

/** Specific dietary patterns within the Food category */
export type FoodDiet = "Vegetarian" | "Mixed Diet" | "Heavy Meat Diet";

/** Union of all specific sub-activity identifiers used by the carbon engine */
export type ActivitySubType = TransportMode | FoodDiet | "Electricity" | "Waste";

export enum Unit {
  Km = 'km',
  Mile = 'mile',
  Kwh = 'kWh',
  MJ = 'MJ',
  Kg = 'kg',
  Lb = 'lb',
  Day = 'day',
}

export interface Activity {
  id: string; // UUID
  type: ActivityType;
  /** Specific sub-activity for emission factor lookup */
  subType: ActivitySubType;
  amount: number; // raw user-supplied amount
  unit: Unit;
  date: string; // ISO 8601 date string
}
