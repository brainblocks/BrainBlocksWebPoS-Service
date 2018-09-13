# BrainBlocksWebPoS-Service

Backend Sevice for [BrainBlocks Web PoS](https://github.com/brainblocks/BrainBlocksWebPoS)

## Running locally

1. Clone the repo
1. Install postgres on your machine
1. Create a postgres database with the following schema

   ```
   -- Table Definition ----------------------------------------------

   CREATE TABLE pos_transactions (
       id integer DEFAULT nextval('transactions_id_seq'::regclass) PRIMARY KEY,
       address text,
       link text,
       type text,
       nano_value bigint,
       currency text,
       fiat_value real,
       created_at timestamp with time zone,
       send_block text,
       token text
   );

   -- Indices -------------------------------------------------------

   CREATE UNIQUE INDEX transactions_pkey ON pos_transactions(id int4_ops);
   ```

1. Create a `.env` file at the root and add contents like the following:
   ```
   NODE_ENV="development"
   STAGE="dev"
   SERVER_PORT="3001"
   DB_HOST="localhost"
   DB_USER="your-db-username"
   DB_NAME="your-db-name"
   DB_PASSWORD="your-db-password-if-any"
   DB_PORT=5432
   ```
1. Then just do `$ npm|yarn install && npm|yarn start`
