const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const upload = require("./src/upload");
const resources = require("./src/resources");
const deleteFile = require("./src/delete");
const search = require("./src/search");
const csp = require("helmet-csp");
// var contentType = require('content-type')

var app = express()

//Conten Security Policy
app.use(csp({
  // Specify directives as normal. Needs to be filled in when in production
  directives: {
    defaultSrc: ["'self'", "localhost:8000"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["style.com"],
    fontSrc: ["'self'", "fonts.com"],
    imgSrc: ["img.com", "data:"],
    sandbox: ["allow-forms", "allow-scripts"],
    reportUri: "/report-violation",
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false  // This is not set.
  },

  // This module will detect common mistakes in your directives and throw errors
  // if it finds any. To disable this, enable "loose mode".
  loose: false,

  // Set to true if you only want browsers to report errors, not block them.
  // You may also set this to a function(req, res) in order to decide dynamically
  // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: false,

  // Set to true if you want to disable CSP on Android where it can be buggy.
  disableAndroid: false,

  // Set to false if you want to completely disable any user-agent sniffing.
  // This may make the headers less compatible but it will be much faster.
  // This defaults to `true`.
  browserSniff: true
}));

/* 
*  To secure the site with features like: DNS prefetching set to off, prevent 
*  clickjacking, remove the X-Powered-By header, HTTP Strict 
*  Transport Security, X-Download-Options for IE8+, keep clients from sniffing 
*  the MIME type, addition of some small XSS protections
*/
app.use(helmet());
 
/*
*  Apply to all requests. No user feedback when rate 
*  limits, as no need to tell a DOS/DDOS attacker what's happening
*/
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP to 300 requests per windowMs
}));

// Whitelisting app url:port for cross domain reqs (in localhost from port 3000 to 8000)
app.use(cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
}));

/*
*  API routes
*/
app.get("/", (req, res) => {
  res.send("<h1>Docker node working</h1>");
});

app.get("/resources", resources);
app.get("/resources/:search", search);
app.post("/upload", upload);
app.delete("/delete", deleteFile);

/*
*  Listen to requests
*/
app.listen(8000, () => {
  console.log("Server started!");
});