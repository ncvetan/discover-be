const axios = require('axios');

async function getPhotoReference(placeSearchText) {
    const placeSearchTextURI = encodeURIComponent(placeSearchText);

    const config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cphotos&input=${placeSearchTextURI}&inputtype=textquery&key=${process.env.GOOGLE_API_KEY}`,
        headers: {},
    };

    let response = await axios(config);
    let result = JSON.stringify(response.data);
    result = JSON.parse(result);
    return String(result.candidates[0].photos[0].photo_reference);

}

module.exports = getPhotoReference;
