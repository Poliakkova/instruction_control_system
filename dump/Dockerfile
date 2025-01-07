# Use the official PostgreSQL image from Docker Hub
FROM my_postgres_image

# Set environment variables for PostgreSQL
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=instructions_db

# Copy the dump file into the container's initialization directory
COPY instruction_db_dump.dump /docker-entrypoint-initdb.d/

# By placing the dump file in /docker-entrypoint-initdb.d/, it will be automatically imported into PostgreSQL on the first container start