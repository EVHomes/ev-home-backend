const config = {
  PORT: process.env.PORT || 8082,
  DB_URL: process.env.DB_URL,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  SECRET_REFRESH_KEY: process.env.SECRET_REFRESH_KEY,
  SECRET_STORAGE_KEY: process.env.SECRET_STORAGE_KEY,
  STORAGE_ABSOLUTE_PATH: process.env.STORAGE_ABSOLUTE_PATH,
  ALLOWED_HOSTS: process.env.ALLOWED_HOSTS,
};

export default config;
