import client from './client';


export const getRestaurant = async () => {
  const { data } = await client.get('/restaurant');
  return data;
};

export const getMenuItems = async (params = {}) => {
  const { data } = await client.get('/menu/items', {
    params: { limit: 6, ...params },
  });
  return data;
};
export const getTablesSummary = async () => {
  const { data } = await client.get('tables-summary');
  return data;
}