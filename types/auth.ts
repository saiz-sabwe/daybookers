export type DashboardScope = "client" | "partner" | "sadmin";

export type Permission =
  | "partner.dashboard.view"
  | "partner.hotels.view"
  | "partner.hotels.manage"
  | "partner.hotel_groups.view"
  | "partner.checkin.manage"
  | "partner.complaints.view"
  | "partner.availability.manage"
  | "partner.pricing.manage"
  | "partner.bookings.view"
  | "partner.payments.view"
  | "partner.earnings.view"
  | "partner.reviews.view"
  | "partner.settings.view"
  | "sadmin.dashboard.view"
  | "sadmin.hotels.view"
  | "sadmin.hotels.manage"
  | "sadmin.users.view"
  | "sadmin.commissions.view"
  | "sadmin.settings.view";

export interface UserAuthContext {
  permissions: Permission[];
}

export const PARTNER_DASHBOARD_PERMISSIONS: Permission[] = [
  "partner.dashboard.view",
  "partner.hotels.view",
  "partner.hotels.manage",
  "partner.hotel_groups.view",
  "partner.checkin.manage",
  "partner.complaints.view",
  "partner.availability.manage",
  "partner.pricing.manage",
  "partner.bookings.view",
  "partner.payments.view",
  "partner.earnings.view",
  "partner.reviews.view",
  "partner.settings.view",
];

export const SADMIN_DASHBOARD_PERMISSIONS: Permission[] = [
  "sadmin.dashboard.view",
  "sadmin.hotels.view",
  "sadmin.hotels.manage",
  "sadmin.users.view",
  "sadmin.commissions.view",
  "sadmin.settings.view",
];
