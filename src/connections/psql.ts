import { Client } from "pg";

const sqlClient = new Client({
  connectionString: process.env.PSQL_CONNECTION_STRING,
});

sqlClient.connect().catch((err) => console.error('Error connecting to the database', err));

export default sqlClient;
