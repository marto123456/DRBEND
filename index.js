import express from "express"
import multer from "multer"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import listingRoutes from "./routes/listings.js"

const app = express()

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("You are not allowed"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../discovereality/public/upload")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  },
})

const upload = multer({ storage })

// app.post("/api/v2/upload", upload.single("file"), function (req, res) {
//   const file = req.file
//   res.status(200).json(file.filename)
// })

app.post("/api/v2/upload", upload.array("file", 3), function (req, res) {
  const file = req.files
  if (Array.isArray(file) && file.length > 0) {
    const unique = Array.from(new Set(file.map((item) => item.filename)))
    console.log(unique)
    res.status(200).json(unique)
    // file.forEach(function (item, index) {
    //   console.log(item, index)
    //   console.log(item.filename)
    //   res.json(item.filename)
    // })
  } else {
    throw new Error("File  upload failed")
  }
  res.status(200).json(file.filename)
})

app.use("/api/v2/auth", authRoutes)
app.use("/api/v2/users", userRoutes)
app.use("/api/v2/listings", listingRoutes)

app.listen(8800, () => {
  console.log("Connected")
})
