export default {
  stage: process.env.STAGE,
  serverPort: parseInt(process.env.SERVER_PORT, 10),
  DATABASE: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    NAME: process.env.DB_NAME,
    PASSWORD: process.env.DB_PASSWORD || null,
    PORT: process.env.DB_PORT
  }
}
