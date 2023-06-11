const path = require('path')
const multer = require('multer')



const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './public/uploads/')
   },

   filename: function (req, file, cb) {
      const originalName = file.originalname
      const timestamp = Date.now()
      const modifiedName = `${timestamp}_${originalName}`
      cb(null, modifiedName)
   }
})

const upload = multer({
   storage: storage,
   fileFilter: function (req, file, cb) {
      const allowedMimeTypes = ["image/png", "image/jpeg"]
      if (allowedMimeTypes.includes(file.mimetype)) {
         cb(null, true)
      } else {
         console.log("Only PNG and JPG images are supported!")
         cb(null, false)
      }
   },
   limits: {
      fileSize: 1024 * 1024 * 2,
   },
})


module.exports = upload