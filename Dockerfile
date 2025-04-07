# Step 1 : Compilation
FROM ubuntu:22.04
## Install dependencies
RUN apt-get -yq update && apt-get -yq install curl && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get -yq install nodejs git clang cmake make gcc g++ libmysqlclient-dev libssl-dev libbz2-dev libreadline-dev libncurses-dev libboost-all-dev mysql-client ca-certificates p7zip-full && update-alternatives --install /usr/bin/cc cc /usr/bin/clang 100 && update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang 100 && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN mkdir /app && cd /app && git clone -b 3.3.5 https://github.com/TrinityCore/TrinityCore.git
RUN mkdir /app/TrinityCore/build && cd /app/TrinityCore/build && cmake ../ -DCMAKE_INSTALL_PREFIX=/app/server -DTOOLS=1 && make -j 4 && make install
RUN find /app/TrinityCore -mindepth 1 -maxdepth 1 ! -name 'sql' -exec rm -rf {} +
EXPOSE 3000
COPY ./backend /app/backend
RUN cd /app/backend && npm ci && chmod +x /app/backend/extract-client-map* && mkdir /app/server/data && mkdir /app/server/logs
CMD ["node", "/app/backend/index.js"]