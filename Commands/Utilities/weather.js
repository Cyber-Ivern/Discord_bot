const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get weather information by zip code')
        .addStringOption(option =>
            option.setName('zipcode')
                .setDescription('Enter the zip code')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Defer the reply immediately before doing anything else
            await interaction.deferReply();
            
            const zipCode = interaction.options.getString('zipcode');
            const apiKey = 'cdcb060e75f5dc099f9284c4d6224200'; // Make sure this is your actual API key

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`, {
                // Add timeout to prevent hanging
                timeout: 5000
            });

            if (!response.ok) {
                return await interaction.editReply('Error: Could not fetch weather data. Please try again.');
            }

            const data = await response.json();
            
            if (data.cod !== 200) {
                return await interaction.editReply('Error: Invalid zip code or weather data unavailable.');
            }

            const weather = {
                temp: Math.round(data.main.temp),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed),
                city: data.name
            };

            await interaction.editReply(
                `Weather in ${weather.city} (${zipCode}):\n` +
                `🌡️ Temperature: ${weather.temp}°F\n` +
                `🌥️ Conditions: ${weather.description}\n` +
                `💧 Humidity: ${weather.humidity}%\n` +
                `💨 Wind Speed: ${weather.windSpeed} mph`
            );
        } catch (error) {
            console.error('Error:', error);
            // Check if the interaction is still valid before trying to reply
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply('Sorry, there was an error fetching the weather data. Please try again.');
            } else {
                await interaction.reply('Sorry, there was an error fetching the weather data. Please try again.');
            }
        }
    },
};
