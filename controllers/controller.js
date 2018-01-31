const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fetch = require("node-fetch");
const Promise = require("es6-promise").Promise;
const moment = require("moment");
require('es6-promise').polyfill();

exports.homePage = ((req, res) => {
  res.render("index", {
    title: "Image Search"
  });
});
exports.empty = ((req, res) => {
  const error = {
    error: "No search term entered"
  }
  res.json(error);
});

//checks search parameters in url are valid
exports.searchCheck = ((req, res, next) => {
  const {
    query,
    params
  } = req;
  const search = {
    query,
    params
  }
  let page;
  // If user doesn't enter page query term, default to first page of results
  if (!Object.keys(req.query)[0]) {
    page = 1;
  } else if (Object.keys(req.query)[0] !== "page") {
    // If user includes query but it isn't 'page' then return an error
    const error = {
      error: "Incorrect query parameter"
    }
    res.json(error);
  }  else {
    // Turn page results into index of first returned page result
    page = (((+search.query.page) - 1) * 10) + 1;
  }
  res.locals.search = search;
  res.locals.page = page;
// Return error if user enters a page higher than 10 (results in page variable being greater than 100, which is the max results)
  if (page > 100) {
    // Need to include max results if page is above 10 
    res.send("Max pages 10");
  } else {
    next();
  }
});
//performs image search if parameters are correct
exports.imageSearch = ((req, res) => {
  const {search } = res.locals;
  const { page } = res.locals;
// Create document for each search query
  const doc = {
    term: search.params.search,
    unix: Date.now(),
    when: moment().format()
  }
// Connect to db and enter search doc
  const dburl = process.env.DATABASE;
  MongoClient.connect(dburl, (err, client) => {
    if (err) throw err;
    const db = client.db("image-search");
    const collection = db.collection("searches");
    collection.insert(doc);
    client.close();
  });
  
  const key = process.env.APIKEY;
  const engine = process.env.ENGINE_ID;
// Perform image search and return results to user
  const searchURL = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${engine}&searchType=image&q=${search.params.search}&start=${page}&fields=items(image(contextLink%2CthumbnailLink)%2Clink%2Csnippet)`;
  let results = [];
  fetch(searchURL, { searchType: "image"})
    .then((resp) => resp.json())
    .then((data) => {
      data.items
        .map(item => {
          const result = {
            link: item.link,
            snippet: item.snippet,
            context: item.image.contextLink,
            thumbnail: item.image.thumbnailLink
          };
        // Push each result into new array
          results.push(result);
        });
      res.json(results);
    });
});

// Route to show user latest 10 searches performed
exports.latestSearch = ((req, res) => {
    const dbUrl = process.env.DATABASE;
 // Connect to DB, find 10 latest entries by time, and return search term and formatted date
  MongoClient.connect(dbUrl, function(err, client) {
    const db = client.db("image-search");
    const collection = db.collection("searches");

    findDocs(db, () => client.close());

    function findDocs(db, callback) {
      collection.find()
        .project({  _id: 0, when: 1, term: 1 })
        .sort({ unix: -1 })
        .limit(10)
        .toArray((err, docs) => {
          if (err) throw err;
          res.json(docs);
          callback(docs);
      });
    }
  });
});