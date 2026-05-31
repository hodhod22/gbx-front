// lib/db.ts
// Mockad databasanslutning – används inte eftersom frontend inte ska prata direkt med databasen
export const query = async (text: string, params?: any[]) => {
  throw new Error("Direct database access from frontend is not allowed. Use backend API.");
};