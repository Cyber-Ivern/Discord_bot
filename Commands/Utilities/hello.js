const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('says hi to user'),
    async execute(interaction) {
        await interaction.reply(`hello ${messageLink.member.user.username}`);
    },
};