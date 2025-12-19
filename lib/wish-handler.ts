import type { Wish } from '../src/services/api';

// In-memory storage (for serverless functions)
// In production, you'd want to use a database like Vercel Postgres, MongoDB, etc.
let wishesData: Wish[] = [];

// Initialize with default data if empty
const initializeData = async () => {
  if (wishesData.length === 0) {
    try {
      // Try to load from a persistent source
      // For now, we'll use the default data structure
      wishesData = [
        {
          id: "1",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          title: "Apple Watch Smartwatch",
          description: "Modern smartwatch with numerous features: health monitoring, notifications, fitness tracking and much more. Perfect companion for an active lifestyle.",
          price: 1299.99,
          createdAt: "2025-01-01T00:00:00.000Z"
        },
        {
          id: "2",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          title: "Sony WH-1000XM5 Wireless Headphones",
          description: "Premium headphones with active noise cancellation, excellent sound quality and long battery life. Perfect for travel and daily use.",
          price: 399.99,
          createdAt: "2025-01-02T00:00:00.000Z"
        }
      ];
    } catch (error) {
      console.error('Error initializing data:', error);
      wishesData = [];
    }
  }
};

// Generate a simple ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 6);
};

export const getWishes = async (): Promise<Wish[]> => {
  await initializeData();
  return wishesData;
};

export const getWishById = async (id: string): Promise<Wish | null> => {
  await initializeData();
  const wish = wishesData.find(w => w.id === id);
  return wish || null;
};

export const createWish = async (wishData: Omit<Wish, 'id'>): Promise<Wish> => {
  await initializeData();
  const newWish: Wish = {
    ...wishData,
    id: generateId(),
    createdAt: wishData.createdAt || new Date().toISOString()
  };
  wishesData.push(newWish);
  return newWish;
};

export const updateWish = async (id: string, wishData: Wish): Promise<Wish> => {
  await initializeData();
  const index = wishesData.findIndex(w => w.id === id);
  if (index === -1) {
    throw new Error('Wish not found');
  }
  wishesData[index] = { ...wishData, id };
  return wishesData[index];
};

export const patchWish = async (id: string, partialWish: Partial<Wish>): Promise<Wish> => {
  await initializeData();
  const index = wishesData.findIndex(w => w.id === id);
  if (index === -1) {
    throw new Error('Wish not found');
  }
  wishesData[index] = { ...wishesData[index], ...partialWish, id };
  return wishesData[index];
};

export const deleteWish = async (id: string): Promise<void> => {
  await initializeData();
  const index = wishesData.findIndex(w => w.id === id);
  if (index === -1) {
    throw new Error('Wish not found');
  }
  wishesData.splice(index, 1);
};

