const http = require('http')
const url = require('url')
const { StringDecoder } = require('string_decoder')
const stringDecoder = require('string_decoder').StringDecoder
console.log(stringDecoder)
var config = require('./config')
const https = require('https')
const fs = require('fs')



// instantaiting the server
const server = http.createServer(function(req,res){
    unifiedServer(req,res)  
})

// start the server
server.listen(config.httpPort,function(){
    console.log(`app listening at port ${config.httpPort} in ${config.envName}`)
})

// instantatiate the https server 
var httpsServerOptions = {
    "key": fs.readFileSync('./https/key.pem'),
    "cert": fs.readFileSync('./https/cert.pem') 
}
const securedServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res)
})

// listening to https server
securedServer.listen(config.httpsPort, function(){
    console.log(`app lsitening at port ${config.httpsPort}`)
})

// all the server logic for both https and http
var unifiedServer = function(req,res){
    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true)  
    console.log(parsedUrl)
    var path = parsedUrl.pathname;

    var trimmedPath = path.replace(/^\/+|\/+$/g,'')
    // get the path 

    // get the query string as an object 
    var queryStringObject = parsedUrl.query
    //send the response
    
    console.log(`${trimmedPath} with ${req.method}`) 
    console.log(queryStringObject)
    //log the request
    

    // get headers as an object
    var headers = req.headers

    console.log('Request recieved with these header:', headers)

    // get payload if any
    var decoder = new StringDecoder('utf-8')
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data)
        console.log(buffer)
    }) 
    req.on('end', function(){
        buffer += decoder.end()

        var chooserHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath]: handlers.notfound;
        // costruct  the data object to send to the handler

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method':req.method, 
            'header':headers,
            'payload':buffer
            // this data will be sent to the choosen handlar
        };
 
        chooserHandler(data, function(statusCode,payload) {
                // use the status code  called back by the handlar or default to 200
                statusCode = typeof(statusCode) == 'number'? statusCode :200

                // use the payload called back by the handler,or deault to empty obj
                payload= typeof(payload) == 'object' ? payload: {}
                // converting payload to a string
  
                var payloadString = JSON.stringify(payload)
                res.setHeader('content-type','application/json')
                res.writeHead(statusCode)
                res.end(payloadString)
                
                console.log(typeof(payload))

                console.log('returning this respons:', buffer,statusCode,payloadString)
        })

        // router the request to the handler specified in the router

       
        
    })
}

// router handlar
 var handlers = {}
  
 handlers.sample = function(data, callback){
          // callback http status code and a payload
     callback(406,{'name':'sample handler'})
 }
 handlers.notfound = function(data, callback){
    callback(404)
 }

var router = {  
    sample:handlers.sample
}


