
// @file dateUtils.ts
// Utility date constants used for setting up initial data
// in the mock store.

// @section Date constants for initial data
export const today = new Date();
export const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
export const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);
