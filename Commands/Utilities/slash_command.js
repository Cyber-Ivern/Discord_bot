const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('hello [name]'),
    async execute(interaction) {
        try {
            if (!process.env.DISCORD_TOKEN) {
                console.error('Discord token not found in environment variables');
                return await interaction.reply({ 
                    content: 'Bot configuration error. Please check environment variables.',
                    ephemeral: true 
                });
            }
            
            await interaction.reply(`hello ${interaction.user.username}`);
        } catch (error) {
            console.error('Error in hello command:', error);
            await interaction.reply({ 
                content: 'An error occurred while processing the command.',
                ephemeral: true 
            });
        }
    },
};

    

    