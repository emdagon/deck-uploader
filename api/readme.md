## Overview

This is a sample Graphql API is based on [Hasura GraphQL Engine (CE)](https://hasura.io/docs/latest/graphql/core/index.html)

It's a pretty basic implementation, with no authentication requirements.

## Requirements

- [Docker](https://www.docker.com/get-started)
- [Hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html)

## Setup

1. Create Postgres and Hasura containers defined in `docker-compose.yaml`:

   ```
   $ docker compose up -d
   ```

2. Then, we need to setup the database and hasura metadata, we do it by applying them with hasura CLI:
   ```
   $ hasura migrate apply
   $ hasura metadata apply
   ```
3. (Optional) We now can explore the Database and the Graphql API using the tool provided by Hasura:
   ```
   $ hasura console
   ```

Have fun!
