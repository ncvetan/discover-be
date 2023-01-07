const axios = require('axios');

async function getPhotoReference(placeSearchText) {
    try {
        const placeSearchTextURI = encodeURIComponent(placeSearchText);

        // This is location biased to Windsor, ON. In the future, user data can be accessed to bias this request to their location
        const config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cphotos&input=${placeSearchTextURI}&locationbias=point%3A42.3149%2C-83.0364&inputtype=textquery&key=${process.env.GOOGLE_API_KEY}`,
            headers: {},
        };

        let response = await axios(config);
        let result = JSON.stringify(response.data);
        result = JSON.parse(result);
        return String(result.candidates[0].photos[0].photo_reference);
    } catch (err) {
        return null;
    }
}

async function getPhoto(photoRef) {
    try{
        const config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.GOOGLE_API_KEY}`,
            headers: {},
            responseType: 'arraybuffer'
        };

        let response = await axios(config);

        const type = response.headers['content-type']
        let base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
        return { type: type, photoB64: base64ImageString}
    } catch (err) {
        return null;
    }
}

module.exports = {getPhotoReference, getPhoto};
