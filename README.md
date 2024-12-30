# Discord.js Boilerplate with TypeScript, Prisma, and Modular Helpers

A scalable and modular Discord bot boilerplate built with Discord.js using TypeScript, Prisma, and a structured file system for easy development and maintenance.

## Features
* Slash Commands: Easy setup and management of Discord slash commands.
* Buttons: Handle button interactions cleanly using helper functions.
* Modals: Integrated modal interactions with customizable input fields.
* Select Menus: Support for multiple select menu types (user, role, string, etc.) with modular and dynamic handling.
* Interaction Handling: A clean and refactored structure to handle all types of interactions (commands, buttons, modals, and select menus).
* Prisma Integration: Database handling using Prisma ORM for efficient user and guild data storage.
* Helper Functions: Helper functions to easily build buttons, modals, select menus, and embeds.
* Event-Driven Architecture: Follows an event-driven architecture for scalable and modular bot development.

## Discord Bot Setup Guide

### Prerequisites

To run this project, you need the following:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [Docker](https://www.docker.com/get-started) (for running PostgreSQL in a container)
- Discord Application: You will need a Discord bot token.

## Environment Variables

Before running the bot, you need to set up your environment variables. Create a `.env` file in the root directory with the following content:

```env
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID
DISCORD_GUILD_ID=YOUR_SERVER_ID
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"
```

* DATABASE_URL: The PostgreSQL connection string using the variables set above or different one if u are using external database
* DISCORD_GUILD_ID: The ID of your Discord server.

## Running PostgreSQL with Docker

Start the PostgreSQL container using Docker Compose:

```bash
docker-compose up -d
```

## Project Setup
* Install the dependencies:

```bash
npm install
```
* Apply Prisma database schema to the PostgreSQL database:

```bash
npx prisma db push
```

* Start the bot
```bash
npm run start
```
The bot should now be running and connected to your Discord server.

### Granting Bot Permissions

To invite the bot to your Discord server with permissions, use the following URL (replace YOUR_DISCORD_CLIENT_ID with your bot's client ID):
```bash
https://discord.com/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&scope=bot&permissions=8
```

## Optional: Changing the .env for Production
If you're running this bot in a production environment, you might want to adjust the database settings in your .env or docker-compose.yml file to reflect the production configuration. You can also set different environment variables for the production database, Discord server, or bot token.

### Key Updates:
1. The `DATABASE_URL` now uses the environment variables for `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.
2. The `docker-compose.yml` file is updated to dynamically use the environment variables from the `.env` file.