
import { Attachment } from '../types';

// Storage for user-specific attachments
export const attachmentsByUser: { [userId: string]: Attachment[] } = {};

// Initialize attachments for both users (empty arrays)
attachmentsByUser['1'] = [];
attachmentsByUser['2'] = [];
