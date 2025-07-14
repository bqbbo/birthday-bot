# Birthday Bot

A lightweight, configurable discord bot which automatically announces birthdays across multiple servers. It favors server administration AND user control!

Birthday Bot is written in NodeJS using the extremely flexible bot creation framework, Discord.js.

## Background

Automatically announcing birthdays can be difficult; remembering potentially hundreds of birthdays across multiple friend-managed servers and announcing them accordingly is not exactly easy.

I had this same problem, asking users for birthdays, forgetting to announce them sometimes, not an ideal situation. The bot solves a variety of problems primarily in smaller servers where announcing a birthday is great for engagement.

This is my largest NodeJS project of roughly 25 hours over 3 days, and the first Discord bot I've made using Discord.js. This is also my first project ever utilizing an external database (MySQL in this project). My future projects will be written with TypeScript.

## Features

I created Birthday Bot to solve the following problems:

-   Users enter their own birthdays instead of telling a staff member when it is. No more forgetting or awkward conversations.
-   Server admins don't have to worry about being accused of biases; birthdays are announced at the same time every day, all at once, all with the same message and role ping.
-   In a community across multiple servers, with potentially mixed users, you will no longer need to announce a user's birthday in each one yourself! They will be announced in all throughout the day.
-   Timezones, and announcement times! A server admin can tailor the announcement time to when their community is most active.

### Settings and Commands

Birthday bot comes with 12 commands that a developer can extend easily for additional functionality. They include five commands for configuring the following settings:

#### Settings for Server Admins

-   **Announcement Time** (`announcement_time`) - The time the bot will announce a birthday, relative to the set timezone (format is 24 hour, `HH:MM`)
-   **Timezone** (`timezone`) - The timezone the bot will use for time calculations
-   **Announcement Message** (`birthday_message`) - A configurable message for birthday announcements (use `{users}` in your message for pings)
-   **Pinging Role** (`ping_role_id`) - The role to ping with in birthday announcements (stored as a Discord role ID)
-   **Announcement Channel** (`channel_id`) - The channel for birthday announcements (stored as a Discord channel ID)

All settings are configurable from builtin admin commands, and users can use the bot to see other birthdays.

#### General Commands

-   **`/help`** - Lists all the commands registered with the bot, and their embedded descriptions

#### Utility Commands

-   **`/echo [message]`** - Echos back user input
-   **`/ping`** - Echos back the bot's latency
-   **`/server-count`** - Echos back the number of servers the bot is in

#### Birthday-related Commands

-   **`/set-birthday [month] [day] [year (opt)]`** - Sets the birthday linked to your user account
-   **`/get-birthday [user]`** - Echos back the birthday of a specified user, if they have set it

#### Configuration Commands (for server admins)

Users must have the Administrator permission to execute the following commands:

-   **`/settings list`** - Lists guild settings, and their defaults
-   **`/settings get [setting_name]`** - Returns the value of a specific setting
-   **`/settings resetall`** - Resets all settings to their defaults
-   **`/settings reset [setting_name]`** - Resets a specific setting to its default
-   **`/set-message [message]`** - Sets the birthday message for announcements
-   **`/set-timezone [timezone]`** - Sets the timezone for time calculations
-   **`/set-role [role]`** - Sets the pinging role for announcements
-   **`/set-announcement-time [time]`** - Sets the time for announcements, relative to the configured timezone
-   **`/set-channel [channel]`** - Sets the channel for birthday announcements

For some configuration commands, specific formatting is required. See above for the correct format.

### User-Oriented, Server-Centric

This bot is designed with **multiple** servers in mind. Server admins cannot adjust a user's birthday themselves, but are at full control for when and how a birthday is announced.

Each server with the bot will announce the birthday of any users that have their birthday on that day, allowing a user to be announced in multiple servers independently over the course of a 24 hour period.

## Using the Bot

Once done setting up the bot, everything is automatically handled. However, the more users that enter their birthday, the more engaging the bot will be.

There are two options for setting up the bot, hosting it yourself, or using my direct clone.

### Option 1 - Self-hosted (Recommended)

Self hosting is recommended for stability, and a streamlined experience across multiple servers in a greater community. However, hosting does require some technical knowledge, a reliable server, and various tools.

1. **Install `node`, `npm`, `mysql`, and `git` on your server.** This process varies per platform but is easiest on Linux.
2. **Create a Discord bot, and add it to a server.** The bot should receive all intents, and the bot scope. For simplicity, give it the Administrator permission. Do **not** enable user installs, only select guild.
3. **Clone the repository.** Executing `git clone https://github.com/bqbbo/birthday-bot.git` will clone the repository into the `birthday-bot` directory.
4. **Run `npm install`.** This will install all necessary packages. Contributors, please install ESLint manually here.
5. **Configure MySQL.** You will need to set a password for the `root` account, and create a database for the bot. See [this page](https://dev.mysql.com/doc/refman/8.4/en/default-privileges.html) for setting a root MySQL password, and [this page](https://dev.mysql.com/doc/refman/8.4/en/creating-database.html) for creating a database. When hosting on Linux, it may be necessary to enable the MySQL service with your init system.
6. **Create `.env`.** Environment variables are needed to utilize the bot safely. See the [dotenv website](https://www.dotenv.org/docs/) for further explanation. Using the `export` command or equivalent on Mac/Windows is also sufficient.

The bot requires the following environment variables to be set:

#### Required Environment Variables

-   **BIRTHDAY_BOT_TOKEN** - Your bot's token, available on the Discord developer portal
-   **BIRTHDAY_BOT_CLIENT_ID** - Your bot's user/client ID, available on the developer portal or Discord directly
-   **BIRTHDAY_BOT_DATABASE_NAME** - The name of the database in the associated MySQL server.
-   **BIRTHDAY_BOT_DATABASE_PASSWORD** - The password of the associated MySQL server.

#### Optional, Case-Specific Environment Variables

-   **BIRTHDAY_BOT_GUILD_ID** - If registering commands using `npm run register:guild`, you will need the guild ID.
-   **BIRTHDAY_BOT_DATABASE_HOST** - If your MySQL server isn't `127.0.0.1`, this must be set to the address of your database. You will need to port forward `3306` or another port (see below) to access your server externally, and your MySQL config will need to allow external inbound connections. Do **not** set this to `localhost`.
-   **BIRTHDAY_BOT_DATABASE_PORT** - If your MySQL server isn't on the default port (`3306`), set this to the correct one. If this server is external, that port will likely need to be forwarded before you can access it.
-   **BIRTHDAY_BOT_DATABASE_USER** - If you are using another MySQL user other than `root`, set it here.
-   **BIRTHDAY_BOT_DATABASE_CHARSET** If you are not using `utf8mb4`, set the charset here.

7. **Register your commands with Discord, `npm run register:global`.** Doing this is required if you are first starting your bot, or if you make any changes/additions to commands. It is recommended if you make any significant change to the source code. If you are registering commands for a specific guild, use `npm run register:guild`. It is **not** recommended to use both (see Known Issues).
8. **Start the bot! `npm start`.** If everything was done correctly, the bot should start up, appear online, and respond to commands.

### Option 2 - Use my implementation

To use a ready-to-go bot, add [Birthdays!](https://discord.com/oauth2/authorize?client_id=1393498638231015546) to your server. You will need sufficient permissions to add and configure the bot.

My bot may go down at any point, and I cannot provide database data.

## Known Issues

-   **Timezones** - Due to Discord's command choice limit, not at 26 timezones can be listed. Only the most popular ones have been added to the default list, which can be changed in `/src/timezones.js`.
-   **DST** - The bot will not automatically update timezones that observe Daylight Savings Time, such as `America/Los_Angeles`.
-   **`{users}`** - If `{users}` is omitted from the announcement message, the bot will **not** announce what users have a birthday on that day.
-   **Guild Configs** - If a bot is kicked from a server, the associated guild data is not automatically removed.
-   **Duplicate Commands** - Using both `npm run register:global` and `npm run register:guild` will result in duplicate, indistinguishable commands.
