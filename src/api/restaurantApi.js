import client from './client';

// GET /restaurant (public). Returns name, description, address, phone,
// latitude, longitude, opening_time, closing_time, and image_url once migrated.
export const getRestaurant = async () => {
  const { data } = await client.get('/restaurant');
  return data;
};

// GET /restaurant/tables-summary (public).
// Returns { total_tables: number, categories: string[] }.
export const getTablesSummary = async () => {
  const { data } = await client.get('/restaurant/tables-summary');
  return data;
};