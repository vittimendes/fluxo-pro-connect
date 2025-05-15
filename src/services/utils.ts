
// Helper functions used across the services

// Generate a unique ID based on timestamp and random number
export const generateUniqueId = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Format date to ISO string but only the date part
export const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Get the current user ID from localStorage
export const getCurrentUserId = (): string => {
  const currentUserJson = localStorage.getItem('currentUser');
  if (currentUserJson) {
    const currentUser = JSON.parse(currentUserJson);
    return currentUser.id;
  }
  return '1'; // Default to first user if none found
};
