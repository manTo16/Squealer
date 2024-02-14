const sharp = require('sharp');



async function resizeBase64Image(base64Image, width, height) {
    if (!base64Image) {
      return '';
    }
  
    // rimuove l'intestazione dei dati, se presente
    const img_format = extractImageFormat(base64Image)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(width, height)
      .toBuffer();
    const resizedBase64Image = addBase64ImageHeader(resizedImageBuffer.toString('base64'), img_format);
  
    return resizedBase64Image;
}


function addBase64ImageHeader(base64Image, format) {
    //const format = extractImageFormat(base64Image)
    // occhio: scrive "null" nel caso format sia null
    const base64ImageWithHeader = `data:image/${format};base64,${base64Image}`;
    return base64ImageWithHeader;
}


function extractImageFormat(base64Image) {
    const match = base64Image.match(/^data:image\/(\w+);base64,/);
    if (match && match[1]) {
      return match[1];
    }
    //se l'immagine non ha intestazione restituisce null
    return null;
}


module.exports = {
    resizeBase64Image,
    addBase64ImageHeader,
    extractImageFormat
}