const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fetch = require('node-fetch');
const Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();
exports.homePage = ((req, res) => {
  res.render("index", {
    title: "Image Search"
  });
});
exports.empty = ((req,res)=>{
const error = {
error:"No search term entered"
}
res.json(error);
});

//checks search parameters in url are valid
exports.searchCheck = ((req, res, next) => {
  const { query, params } = req;
  const search = {
    query,
    params
  }
 let page;
 if (!Object.keys(req.query)[0]) {
   page = 1;
 } else if (Object.keys(req.query)[0] !== "page") {
   const error = {
     error: "Incorrect query parameter"
   }
   res.json(error);
 } else if (!Object.keys(req.query)[0]) {
   page = 1;
 } else {
   page = (((+search.query.page) - 1) * 10) + 1;
 }
  // Need to set page to 1 if they don't include a page query
  
  // Need to have repsonse if they don't use page as the query parameter
   res.locals.search = search;
  res.locals.page = page;
  if (page > 100) {
    // Need to include max results if page is above 10 
    res.send("Max pages 10");
  } else {
    next();
  }
});

exports.imageSearch = ((req, res) => {
  const { search } = res.locals;
  const { page } = res.locals;
  const key = process.env.APIKEY;
  const engine = process.env.ENGINE_ID;
  
  const searchURL = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${engine}&searchType=image&q=${search.params.search}&start=${page}&fields=items(image(contextLink%2CthumbnailLink)%2Clink%2Csnippet)`;
  let results=[];
  fetch(searchURL, { searchType: "image"})
    .then((resp) => {
    return resp.json()
  })
    .then((data) => {
     data.items
    .map(item => {
    const result = {
    link:item.link,
    snippet:item.snippet,
    context:item.image.contextLink,
    thumbnail:item.image.thumbnailLink
     }
    results.push(result);
    })
  
    res.json(results);
  });
});

exports.image = ((req, res) => {
  // URL for databse
  const url = process.env.DATABASE;
  // Connect to DB
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log("Successfully connected to db");
    // Access url shortener DB
    const dbo = db.db("");
    // Assign const to access urls collection
    const col = dbo.collection("");
    // Function to create unique hashid based on timestamp of request (id)
    // Query DB to find the original URL the user entered
    col.find({}).toArray((err, doc) => {
      if (err) throw err;
      // If the document does exist return the object to the user, showing both the original URl and the new shortened URL
      db.close();
    });
  });
});