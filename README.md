README template
# Serdar - 28 July 2019
## Installation

I'll write docker instructions but they're both hanging in my local machine, worth a try:
1- Open a new terminal tab
2- cd to dir-root/docker-node
3- Run docker-compose up
4- Check localhost:8000 to make sure it's running, if it is hurray!
6- Open a new terminal tab
7- cd to dir-root/docker-react
8- Run this to build the image: docker image build -t react:app .
9- Run hot reloading instance by typing: docker container run -it -p 3000:3000 -p 35729:35729 -v $(pwd):/app react2:app
10- Go to localhost:3000 on your browser to start interacting with the backend, now it's /tmp of your docker instance so knock yourself out by deleting/adding whatever file you like.

Dockerless instructions:
1- Open a new terminal tab
2- cd to dir-root/docker-node
3- npm i * (Also before running install, pm2 is going to be installed none globally perhaps you may want to delete pm2 from package.json dependencies and install it globally by running (npm i -g pm2) instead.)
4- sudo pm2-runtime server.js (mind you you will see your /tmp files on mac or linux, don't delete anything you haven't added, sorry I'll make tmp folder editable in a future release. Should work sudoless in docker mode.)
5- Go to localhost:8000 in your browser to see the deceiving "Docker node working" message
6- Open a new terminal tab
7- cd to dir-root/docker-react
8- npm i
9- npm start
10- Go to localhost:3000 on your browser to start interacting with the backend, remember only delete files you uploaded in this mode not to mess with your OS, just in case.

## Security
###Three most common attack vectors are:

####Parameters:
Parameter attacks exploit the data sent into an API, including
URL, query parameters, HTTP headers, and/or post content.

####Identity
Identity attacks exploit flaws in authentication, authorization,
and session tracking. In particular, many of these are the result
of migrating bad practices from the web world into
API development.

####Man-in-the-Middle
These attacks intercept legitimate transactions and exploit
unsigned and/or unencrypted data being sent between the
client and the server. They can reveal confidential information
(such as personal data), alter a transaction in flight, or even
replay legitimate transactions.

###Addressed:
1- Up to date dependencies: Majority of attack vectors go through out of date dependencies, so it's important to keep all dependencies up to date as time goes
2- Body, querystring, URL and HTTP headers and the content posted are all checked for possible threats.
3- Whitelisting domains - this closes a massive surface for attack, cors headers whitelisted to localhost:3000 (this'd be our domain on live obviously.), I'd need to whitelist other services like automation, message queues, websockets etc if I built those later.
4- Content security policy added for node app (not for webpack for the react app, I'd do that)
5- Helmet was used to close a lot of security holes
6- RateLimit plugin was used to limit requests coming in by client IPs so we don't get DOS DDOS attacked too easily
7- Joi package is used to make sure a lot of 
8- Search by file name functionality is debounced to make sure we don't flood the server when user is typing
9- When searching for files to return on nodejs side, I used indexof instead of regex to make sure I don't take the server down.

###Not addressed:
1- Authentication and Authorization, now everyone can delete everyone else's file.
2- multer is added as a middleware across the backend, which is a security vulnarability whenAuthentication is added, it should be imported only on requests that will handle file manipulations.
3- HTTPS, currently the hyper text transfer protocol is unencrypted and not safe, so the app is open to man in the middle attacks and data stream eavesdropping. also HTTP Public Key Pinning can be enabled to stop MITM attacks too. Reason these are not done is because it's unnecessary in dev mode but once we deploy the API to production we can buy an SSL certificate from a trusted certificate authority and deploy this. Otherwise we'd have to use OpenSSL to create a root certificate and tell our computer to trust it which adds unwanted time consuming steps to setup.
4- DDOS attacks can happen, setting up cloudflare would prevent that as well as other types of attacks. (although express-rate-limit is installed to limit IPs to certain requests, attacks can happen with multi-vector and morphing abilities)
5- Services are not running part of a Virtual Private Cloud/Network, which means they're open to public www, with no security groups, firewalls or protection.
6- files uploaded are not being encrypted while stored
7- Type checks may fail on race condition depending on filesize - this is because I invested time to build file uploads with formidable IncomingForm, and the event handling is quite terrible whereas when fileBegin event is thrown and I do validation with joi, I cannot virtually stop transmission at the time and file may endup uploaded. I needed more time to switch to multer to handle it better but ran out of time, hence this needs to be improved, I wrote a quick "mark files for deletion if it fails validation" however it is a big security hole that I wouldn't repeat again.


## Improvements
1- Pagination, ideally load more as you scroll
2- Listing of files sorted by size, filename (alphanumerically), sort by date of upload
3- Edit file (upload a different binary for the same name)
4- Edit contents of file (brings a whole different level of architectural security implications)
5- A database to keep file information on, rather than accessing files to check attributes such as size etc.
6- Authentication to give access control layers to the application and ensure privacy of files.
7- Use of a content delivery network 
8- Use of an object storage service like S3 that offers industry-leading scalability, data availability, security, and performance.
9- Move all settings in the server like rate limiting times and amounts, cors origin, listened port etc to a config file, move routes to its own file, refactor code.
10- Same file dropped will upload again, might be good to check it in the future.
11- for all actions (upload, list resources, delete) we need authentication to check user has authorization to do so
12- Capcha check if one ip is trying too many requests
13- Data integrity checks - send with checksum, confirm integrity
14- Ensuring data is strongly typed, correct syntax, within length boundaries, contains only permitted characters, or that numbers are correctly signed and within range boundaries
15- Write a proper error handling HOC for cleaner code.
16- React app's using material ui and is kind of pretty but especially with resizing etc I would've done a lot better job given the time and if I didn't have to worry about other things
17- Unit tests on react app - this wasn't entirely built with a TDD approach due to time limit and panic, need to improve on that 
18- Flow was used but it became a bit annoying to fight with types rather than writing core functionality so it is kinda broken now.
19- Both apps were written with docker, however adding and removing things both environments broke so I ended up running them individually, sorry about that, initially I wrote both to run on docker-compose on single command, later one broke and I ran them separately, later both of them started hanging, instead of diving deep to fix them I opted out and run node app with sudo pm2 (as I use local tmp folder to save files to) and react app with good old react-scripts
20- I would use validation and more feedback for frontend too but i ran out of time (not that it matters from security perspective too much but UX perspective, anything on a browser can be fiddled with, it's the API that needs to be strong)
21- Some minor UI bugs such as when filtered deleting causes all files to be loaded, it should be only filtered ones
22- Need to break down large components more into pure/memoized functions within view files, did not have time to do this, paired with lacking TDD, if I did this properly I would not have a backend to query

## Libraries
###Frontend:
1- flow-bin: type checking and type safety
2- material-ui-core: for a very pretty textfield and pretty Grid system

###Backend
1- helmet: by default turns X-DNS-Prefetch-Control header off (privacy benefit), adds X-Frame-Options set to SAMEORIGIN which allows me to control whether the page can be loaded in a frame, 
2- express: So that I write a more structural node app with Express framework.
3- cors: to whitelist react's domain and port so that cross domain requests can be made
4- formidable: to parse uploaded files
5- joi: for validating the incoming queries / params / requests properly, without security issues or taking the site down (ie regexp)
6- express-rate-limit: to make sure we don't get DOS/DDOS attacked

dev:
eslint: to have some sort of structure to my syntax
eslint-plugin-security: help identify potential security hotspots as I develop the apis

## API
```
### GET /resources
// Description of the endpoint:
// - what does the endpoint do?
Returns all files in the API.
// - what does it return?
200:
Returns all files in the API.
400:
In case local folder contents cannot be read. 
// - does it accept specific parameters?
No querystring or path params accepted.

### GET /resources/:search
// Description of the endpoint:
// - what does the endpoint do?
Returns all files in the API containing search parameter passed as first argument.
// - what does it return?
200:
Returns all files in the API containing search parameter passed as first argument.
400:
In case local folder contents cannot be read. 
// - does it accept specific parameters?
Parameter: search
Parameter type: URL Path
Desc: Allows filtering files returning from the API request.
Data Type: String

### DELETE /delete/?file
// Description of the endpoint:
// - what does the endpoint do?
Deletes one file in the API with the name of the file querystring parameter passed.
// - what does it return?
200:
Deleted the file with the name of the file querystring parameter passed.
400:
Could not find the file with the name of the file querystring parameter passed.
500:
Something went wrong while deleting the file querystring parameter passed.
// - does it accept specific parameters?
Parameter: file
Parameter type: Querystring
Desc: Allows deleting the file with the specified filename with the file querystring parameter passed.
Data Type: String

### POST /upload
// Description of the endpoint:
// - what does the endpoint do?
Uploads the file or multiple files the client has requested
// - what does it return?
200:
Returned for each file uploaded at a given request.
400:
File passed was either too large (max 10MB) or of wrong MIME Type (PNG, JPEG, JPG allowed only)
500:
Something went wrong while uploading or saving the file posted
// - does it accept specific parameters?
No querystring or path params accepted.

```



---
## Other notes
Biggest issue was not using redux.