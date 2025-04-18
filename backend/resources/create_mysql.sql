CREATE USER '<DATABASE_USER>'@'%' IDENTIFIED BY '<DATABASE_PASSWORD>' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0;

GRANT USAGE ON * . * TO '<DATABASE_USER>'@'%';

CREATE DATABASE `<WORLD_DATABASE_NAME>` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE `<CHARACTER_DATABASE_NAME>` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE `<AUTH_DATABASE_NAME>` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `<WORLD_DATABASE_NAME>` . * TO '<DATABASE_USER>'@'%' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON `<CHARACTER_DATABASE_NAME>` . * TO '<DATABASE_USER>'@'%' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON `<AUTH_DATABASE_NAME>` . * TO '<DATABASE_USER>'@'%' WITH GRANT OPTION;