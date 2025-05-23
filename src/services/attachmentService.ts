
import { Attachment } from './types';
import { attachmentsByUser } from './store/attachmentsStore'; 
import { generateUniqueId, getCurrentUserIdSync, formatDate } from './utils';

export const attachmentService = {
  getAttachmentsByClientId: (clientId: string): Promise<Attachment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        const userAttachments = attachmentsByUser[userId] || [];
        const clientAttachments = userAttachments.filter(attachment => attachment.clientId === clientId);
        
        resolve([...clientAttachments]);
      }, 500);
    });
  },

  addAttachment: (attachment: Omit<Attachment, 'id' | 'userId' | 'dateUploaded'>): Promise<Attachment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        const newAttachment = {
          ...attachment,
          id: generateUniqueId('attachment'),
          userId,
          dateUploaded: formatDate(new Date())
        };
        
        if (!attachmentsByUser[userId]) {
          attachmentsByUser[userId] = [];
        }
        
        attachmentsByUser[userId].push(newAttachment);
        resolve(newAttachment);
      }, 500);
    });
  },

  deleteAttachment: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        if (!attachmentsByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = attachmentsByUser[userId].findIndex(attachment => attachment.id === id);
        if (index !== -1) {
          attachmentsByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
};
