# TrinityCore 3.3.5 Docker Environment
![Action State](https://github.com/valcriss/trinitycore-335-docker/actions/workflows/docker-build-push.yml/badge.svg)  ![Docker Pulls](https://img.shields.io/docker/pulls/danielsilvestre37/trinitycore-335-docker)

This project provides a Dockerized environment for experimenting, developing, and researching with the [TrinityCore 3.3.5](https://www.trinitycore.info/) World of Warcraft server emulator. It is intended for educational and non-commercial use only.

## 🚀 Features
- Easy setup with Docker Compose
- Automated database initialization and data extraction
- Minimal manual intervention required
- Web interface for interacting with the worldserver process

## ⚙️ Requirements
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 📦 What's Included
- TrinityCore 3.3.5 core
- Automated setup scripts
- MySQL database server
- Web interface for server interaction

## 📁 Project Structure

```
trinitycore-335-docker/
├── client/     # Folder where you must place the 3.3.5 WoW client files
└── docker-compose.yml
```

## 🛠️ Installation Steps
1. **Prepare directories and etreive the require files**
```bash
mkdir trinitycore-335-docker
cd trinitycore-335-docker
curl -o docker-compose.yml https://raw.githubusercontent.com/valcriss/trinitycore-335-docker/refs/heads/main/docker-compose.yml
mkdir client
```

2. **Place your WoW 3.3.5 client files in the `client/` directory**

3. **Edit in the docker-compose.yml file the environment section according to your needs (public ip address, 127.0.0.1 if your computer hosts the game and the server).**

4. **Start the environment**
```bash
docker-compose up -d
```

The system will automatically:
- Download and initialize required databases
- Extract map and DBC data from your client files
- Start both `authserver` and `worldserver`

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                         TrinityCore 335 Docker 1.0.0                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                         Checking database connection                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Connection to database successful.                                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                         Checking databases structure                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Databases are initialized.                                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                           Checking databases data                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Databases are not empty.                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                   Updating auth server configuration files                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Writing auth server configuration successful.                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                  Updating world server configuration files                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Writing world server configuration successful.                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                        Updating application database                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Application database update successful.                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                         Updating realm informations                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Realm informations update successful.                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                           Checking client map data                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Client map data present.                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                         Application Startup Complete                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                Web interface listening on http://0.0.0.0:3000                ║
╚══════════════════════════════════════════════════════════════════════════════╝
```


## 🧪 Using the Server
After startup, you can access the web interface to control the server:

```http
http://<container-ip>:3000
```

Through the web interface, you can send commands to `worldserver`, such as creating game accounts.

![Screenshot of the web interface](./docs/web-interface.png)


> ⚠️ Don’t forget to edit your **realmlist.wtf** file to point to the container’s IP address.

## ❓ Notes
- A compatible 3.3.5 WoW client is required, but **not provided**.
- All databases (`auth`, `characters`, `world`) are automatically created and populated at first run.
- Account creation is handled via the web UI or TrinityCore commands.

⚠️ This project is not affiliated with or endorsed by Blizzard Entertainment or TrinityCore. Use of the trinitycore emulator is intended strictly for educational and non-commercial purposes.

### How to create an account on TrinityCore worldserver (via the web interface)
```
.account create myuser mypass
.account set gmlevel myuser 3 -1
.account set addon myuser 2
```

## 📌 Services Defined in `docker-compose.yml`
- **`trinitycore-335-docker`**: the main container running all automation scripts, TrinityCore binaries, and the web interface
- **`database`**: MySQL database server used by TrinityCore

## 💡 Troubleshooting & Tips
- Ensure the WoW client version is **exactly 3.3.5a (12340)** for extraction to succeed.
- If the client files are not correctly placed in `client/`, extraction and setup will fail.
- Use `docker logs <container-name>` for debugging.

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## 📜 License
This project is open-source under the MIT License.

