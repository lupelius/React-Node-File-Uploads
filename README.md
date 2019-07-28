README template
# Serdar - 28 July 2019
## Installation
// All the instructions to run the application
1- ...
## Security
// List security concerns:
// - that have been addressed
// - that have *not* been addressed
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
3- Whitelisting domains - this closes a massive surface for attack


###Not addressed:
1- Authentication and Authorization, now everyone can delete everyone else's file.
2- multer is added as a middleware across the backend, which is a security vulnarability whenAuthentication is added, it should be imported only on requests that will handle file manipulations.
3- HTTPS, currently the hyper text transfer protocol is unencrypted and not safe, so the app is open to man in the middle attacks and data stream eavesdropping. also HTTP Public Key Pinning can be enabled to stop MITM attacks too. Reason these are not done is because it's unnecessary in dev mode but once we deploy the API to production we can buy an SSL certificate from a trusted certificate authority and deploy this. Otherwise we'd have to use OpenSSL to create a root certificate and tell our computer to trust it which adds unwanted time consuming steps to setup.
4- DDOS attacks can happen, setting up cloudflare would prevent that as well as other types of attacks. (although express-rate-limit is installed to limit IPs to certain requests, attacks can happen with multi-vector and morphing abilities)
5- Services are not running part of a Virtual Private Cloud/Network, which means they're open to public www, with no security groups, firewalls or protection.
6- files uploaded are not being encrypted while stored

## Improvements
// What could be added to the app / API?
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

## Libraries
// What external libraries have you used and why?
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
// Any general observation about the API?
// document each endpoint using the following template:
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
// Anything else you want to mention
