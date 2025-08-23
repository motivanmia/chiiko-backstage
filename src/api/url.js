const { VITE_API_BASE } = import.meta.env;

const url = {
  product: `${VITE_API_BASE}/product`,
  member: `${VITE_API_BASE}/member`,
  order: `${VITE_API_BASE}/order`,
  recipe: `${VITE_API_BASE}/recipe`,
  school: `${VITE_API_BASE}/school`,
  users: `${VITE_API_BASE}/users`,
};

export default url;
