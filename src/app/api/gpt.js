const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Spotify API credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const refreshToken = 'YOUR_REFRESH_TOKEN'; // You need to get this token through Spotify's authentication flow

const base64Auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const apiUrl = 'https://api.spotify.com/v1';

async function getAccessToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${base64Auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
}

async function searchAndAddTrack(token, trackName) {
    try {
        const response = await axios.get(`${apiUrl}/search`, {
            params: {
                q: trackName,
                type: 'track',
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const trackId = response.data.tracks.items[0].id;
        
        await axios.put(
            `${apiUrl}/me/tracks`,
            [trackId],
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(`Added track "${trackName}" to Liked Tracks.`);
    } catch (error) {
        console.error('Error searching and adding track:', error.message);
    }
}

async function processLocalMusicFolder(token, folderPath) {
    try {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            if (path.extname(file) === '.mp3') {
                const trackName = path.basename(file, path.extname(file));
                await searchAndAddTrack(token, trackName);
            }
        }

        console.log('Finished processing local music folder.');
    } catch (error) {
        console.error('Error processing local music folder:', error.message);
    }
}

(async () => {
    const accessToken = await getAccessToken();
    const localMusicFolderPath = 'PATH_TO_LOCAL_MUSIC_FOLDER';

    await processLocalMusicFolder(accessToken, localMusicFolderPath);
})();
