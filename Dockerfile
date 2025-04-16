# Step 1 : Compilation
FROM ubuntu:22.04
## Install dependencies
RUN apt-get -yq update && apt-get -yq install curl && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get -yq install nodejs git clang cmake make gcc g++ libmysqlclient-dev libssl-dev libbz2-dev libreadline-dev libncurses-dev libboost-all-dev mysql-client ca-certificates p7zip-full && update-alternatives --install /usr/bin/cc cc /usr/bin/clang 100 && update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang 100 && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN mkdir /app
## Install regular TrinityCore
RUN cd /app && git clone -b 3.3.5 https://github.com/TrinityCore/TrinityCore.git TrinityCore
## Install TrinityCore Bots
RUN cd /app && git clone -b npcbots_3.3.5 https://github.com/trickerer/TrinityCore-3.3.5-with-NPCBots.git TrinityCoreBots
## Build regular TrinityCore
RUN mkdir /app/TrinityCore/build && cd /app/TrinityCore/build && cmake ../ -DCMAKE_INSTALL_PREFIX=/app/server -DTOOLS=1 && make -j 4 && make install
## Build TrinityCore Bots
RUN mkdir /app/TrinityCoreBots/build && cd /app/TrinityCoreBots/build && cmake ../ -DCMAKE_INSTALL_PREFIX=/app/server/bots -DTOOLS=1 && make -j 4 && make install
## Clean regular TrinityCore
RUN find /app/TrinityCore -mindepth 1 -maxdepth 1 ! -name 'sql' -exec rm -rf {} +
## Clean regular TrinityCore
RUN find /app/TrinityCoreBots -mindepth 1 -maxdepth 1 ! -name 'sql' -exec rm -rf {} +
## Build Bots SQL files
RUN chmod +x /app/TrinityCoreBots/sql/Bots/*.sh && cd /app/TrinityCoreBots/sql/Bots/ && /app/TrinityCoreBots/sql/Bots/merge_sqls_auth_unix.sh && /app/TrinityCoreBots/sql/Bots/merge_sqls_characters_unix.sh && /app/TrinityCoreBots/sql/Bots/merge_sqls_world_unix.sh
EXPOSE 3000
COPY ./backend /app/backend
RUN cd /app/backend && npm ci && chmod +x /app/backend/extract-client-map* && mkdir /app/server/data && mkdir /app/server/logs
CMD ["node", "/app/backend/index.js"]