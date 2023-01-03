import { db } from "../db.js"
import jwt from "jsonwebtoken"

export const getListings = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM listings WHERE cat=?"
    : "SELECT * FROM listings"

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err)

    return res.status(200).json(data)
  })
}

export const getListing = (req, res) => {
  const q =
    "SELECT l.id, `username`, `title`, `desc`, l.img, u.img AS userImg, `cat`, `price`, `date` FROM users u JOIN listings l ON u.id = l.uid WHERE l.id = ? "

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json("err")

    return res.status(200).json(data[0])
  })
}

export const addListing = (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json("Not authenticated!")

  jwt.verify(token, "mysupersecretpassword", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")

    const q =
      "INSERT INTO listings(`title`, `desc`, `price`, `cat`, `stat`, `date`, `amenities`,`area`, `bedrooms`, `bathrooms`,`img`, `uid`) VALUES (?)"

    const values = [
      req.body.title,
      req.body.desc,
      req.body.price,
      req.body.cat,
      req.body.stat,
      req.body.date,
      JSON.stringify(req.body.amenities),
      req.body.area,
      req.body.bedrooms,
      req.body.bathrooms,
      JSON.stringify(req.body.img),
      userInfo.id,
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.json("Listing has been created.")
    })
  })
}

export const deleteListing = (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json("Not authenticated")
  jwt.verify(token, "mysupersecretpassword", (err, userInfo) => {
    if (err) return res.status(400).json("Token is not valid")
    const listingId = req.params.id
    const q = "DELETE FROM listings WHERE `id` = ? AND `uid` = ?"

    db.query(q, [listingId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your listing")
      return res.json("listing deleted successfully")
    })
  })
}

export const updateListing = (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json("Not authenticated!")

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")

    const listingId = req.params.id
    const q =
      "UPDATE listings SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?"

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat]

    db.query(q, [...values, listingId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.json("Post has been updated.")
    })
  })
}

export const displayListingsBasedOnUsername = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM listings WHERE cat=?"
    : "SELECT * FROM listings"

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err)

    return res.status(200).json(data)
  })
}
