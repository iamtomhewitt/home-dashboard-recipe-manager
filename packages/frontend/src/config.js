const config = {
  baseUrl: process.env.NODE_ENV === 'development' ?
    'http://localhost:3001' :
    'https://home-dashboard-recipe-manager.herokuapp.com',
};

export default config;
