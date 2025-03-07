const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('responds with date and time'),
    async execute(interaction) {
        await interaction.reply(`the current date and time is ${new Date().toLocaleString()}`);
    },
};
