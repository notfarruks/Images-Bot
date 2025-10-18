const axios = require("axios");
const BASE_URL = "https://pixabay.com/api/";

module.exports = async (q) => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        key: process.env.IMAGE_KEY,
        q,
        image_type: "photo",
        safesearch: true
      }
    });
    return res; // keep returning the full axios response, as in your original
  } catch (e) {
    console.log(e);
  }
};
