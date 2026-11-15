import client from './client';

// GET /restaurant (public). Returns name, description, address, phone,
// latitude, longitude, opening_time, closing_time, and image_url once migrated.
export const getRestaurant = async () => {
  const { data } = await client.get('/restaurant');
  return data;
};

// GET /menu/items (public). Returns { items, page, limit, total, hasNextPage }.
// Pass extra query params when needed, for example { limit: 20, page: 2 }.
export const getMenuItems = async (params = {}) => {
  const { data } = await client.get('/menu/items', {
    params: { limit: 6, ...params },
  });
  return data;
};