# Image Search

This project has two endpoints, an image search and a log of recent user searches
## Image Search Abstraction API

API endpoint takes two parameters, the search term and a page number of results; 10 results per page, maximum 10 pages

**input:

    https://imgs.glitch.me/api/imagesearch/chickens?page=1

**output:

    [ {
    "link":"http://hobbyfarms.com.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/02/27200444/parasites_thinkstock.jpg",
    "snippet":"3 Parasites That Can Infect Your Chickens - Hobby Farms",
    "context":"http://www.hobbyfarms.com/3-parasites-can-infect-chickens/",
    "thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI5BuwXYTgntdD6lH-f8o9x959CWGcakxgS0jexRJIJoDnbtDs1fHYw49U"
    },
    {
    "link":"https://images.meyerhatchery.com/ProductImages/50811.gif?1",
    "snippet":"Chickens For Sale | Meyer Hatchery",
    "context":"https://www.meyerhatchery.com/get_subcat.a5w?cat=1020",
    "thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDb69Dt9u1p0LuJ0iM-8tqgQEaSRhNaLeI2m52j789-3ie59EkQWW-umdY"
    },
    ...
    ]
## Recent Search Log

Shows the last ten searches

**input:

    https://imgs.glitch.me/api/latest/imagesearch

**output:

    [{"term":"chickens","when":"2018-01-31T20:51:26+00:00"},
    {"term":"trees","when":"2018-01-31T20:47:15+00:00"},
    {"term":"pasta","when":"2018-01-31T18:49:38+00:00"},
    {"term":"pasta","when":"2018-01-31T18:49:30+00:00"},
    {"term":"pasta","when":"2018-01-31T18:49:22+00:00"},
    {"term":"pasta","when":"2018-01-31T18:49:17+00:00"},
    {"term":"pasta","when":"2018-01-31T18:49:08+00:00"},
    {"term":"paper","when":"2018-01-31T18:41:02+00:00"},
    {"term":"papaer","when":"2018-01-31T18:40:56+00:00"},
    {"term":"tables","when":"2018-01-31T18:40:49+00:00"}]
