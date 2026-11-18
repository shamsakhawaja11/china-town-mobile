import client from './client';

export const getMenuCategories = async () => {
  const { data } = await client.get('/menu/categories');
  return data;
};

export const getMenuItems = async (params = {}) => {
  const { data } = await client.get('/menu/items', { params });
  return data;
};

