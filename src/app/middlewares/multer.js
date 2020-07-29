const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now().toString()}-${file.originalname}`)
    }
})
const fileFilter = (req, file, callback) => {
    const isAccecpted = ['imagem/png', 'image/jpg', 'image/jpeg']
        .find(acceptedFormat => acceptedFormat == file.mimetype)
    if (isAccecpted) {
        return callback(null, true)
    }
    return callback(null, false)
}
module.exports = multer({
    storage,
    fileFilter
})