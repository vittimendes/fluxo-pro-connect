
// @file utils.ts
// Core utility functions used throughout the application for
// class name management.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// @utility Merge and process class names with Tailwind support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
