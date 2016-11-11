var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

var indexPage, index2Page, movie_webm, movie_mp4, movie_ogg;

// load the video files and the index html page
//sudo apt-get install gpac
//MP4Box  -fps 30  -add infile.h264 outfile.mp4
//omxplayer outfile.mp4
fs.readFile(path.resolve(__dirname,"video-from-h264.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_webm = data;
});
fs.readFile(path.resolve(__dirname,"video.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});
fs.readFile(path.resolve(__dirname,"video.m4v"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_ogg = data;
//console.log( movie_ogg.length );
});

fs.readFile(path.resolve(__dirname,"index.html"), function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});
fs.readFile(path.resolve(__dirname,"index2.html"), function (err, data) {
    if (err) {
        throw err;
    }
    index2Page = data;
});
fs.readFile(path.resolve(__dirname,"index3.html"), function (err, data) {
    if (err) {
        throw err;
    }
    index3Page = data;
});
// create http server
http.createServer(function (req, res) {
    
    var reqResource = url.parse(req.url).pathname;
    //console.log("Resource: " + reqResource);

    if(reqResource == "/"){
    
        //console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();

    } else if(reqResource == "/index2"){

        //console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(index2Page);
        res.end();

    } else if(reqResource == "/index3"){

        //console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(index3Page);
        res.end();

    } else if (reqResource == "/favicon.ico"){
    
        res.writeHead(404);
        res.end();
    
    } else {

            var total;
            if(reqResource == "/video.mp4"){
                total = movie_mp4.length;
            } else if(reqResource == "/video.m4v"){
                total = movie_ogg.length;
            } else if(reqResource == "/video-from-h264.mp4"){
                total = movie_webm.length;
            } 
                
            var range = req.headers.range;

            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            // if last byte position is not present then it is the last byte of the video file.
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end-start)+1;

            if(reqResource == "/video.mp4"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(movie_mp4.slice(start, end+1), "binary");

            } else if(reqResource == "/video.m4v"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(movie_ogg.slice(start, end+1), "binary");

            } else if(reqResource == "/video-from-h264.mp4"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(movie_webm.slice(start, end+1), "binary");
            }
    }
}).listen(8888, '192.168.0.6');
console.log('server running at http://192.168.0.6'); 
