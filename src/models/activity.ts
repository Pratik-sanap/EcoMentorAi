/* src/models/activity.ts */
export enum ActivityType {
  Transport = 'Transport',
  Food = 'Food',
  Energy = 'Energy',
  Waste = 'Waste',
  Shopping = 'Shopping',
}

export enum Unit {
  Km = 'km',
  Mile = 'mile',
  Kwh = 'kWh',
  MJ = 'MJ',
  Kg = 'kg',
  Lb = 'lb',
}

export interface Activity {
  id: string; // UUID
  type: ActivityType;
  amount: number; // raw user-supplied amount
  unit: Unit;
  date: string; // ISO 8601 date string
}
