const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get weather information for a zip code')
        .addStringOption(option =>
            option.setName('zipcode')
                .setDescription('Enter the zip code')
                .setRequired(true)),
                
    async execute(interaction) {
        try {
            console.log('checkpoint 1');
            const zipCode = interaction.options.getString('zipcode');
            const apiKey = process.env.WEATHER_API_KEY;

            await interaction.deferReply();

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`,
                {timeout: 10000}
            );

            const data = await response.json();
            
            if (data.cod !== 200) {
                return interaction.editReply('Error: Invalid zip code or weather data unavailable.');
            }

            return interaction.editReply(
                `Weather in ${data.name}: ${data.main.temp}°F, ${data.weather[0].description}`
            );

        } catch (error) {
            console.error('Error:', error);
            return interaction.editReply('Sorry, there was an error fetching the weather data. Please try again.');
        }
    },
};



