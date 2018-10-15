var Google = require('googleapis');
var OAuth2 = Google.auth.OAuth2;
var Promise = require("bluebird");

function GoogleDrive (opts) {    

    if (!(this instanceof GoogleDrive))
        return new GoogleDrive(opts);

    this.config = opts;

    this.service = Google.drive('v3');
    
    this.oauth2Client = new OAuth2(
        this.config.clientID,
        this.config.clientSecret,
        this.config.callbackURL);
}

GoogleDrive.prototype.getFile = function(accessToken, refreshToken, id) {

    var self = this;

    // Retrieve tokens via token exchange explained above or set them:
    self.oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
        // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
        // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
    });

    return new Promise (function(resolve,reject) {

        var result = self.service.files.get({
            auth: self.oauth2Client,                
            fileId: id,
            alt: 'media'
        })
        .on('error',reject)
        
        resolve(result);
    });
}

GoogleDrive.prototype.createFile = function(accessToken, refreshToken, file) {

    var self = this;

    // Retrieve tokens via token exchange explained above or set them:
    self.oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
        // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
        // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
    });


    return new Promise (function(resolve,reject) {

        self.service.files.create({
                auth: self.oauth2Client,      
                resource: {
                    name: file.originalname,
                    mimeType: file.mimetype
                },
                media: {
                    mimeType: file.mimetype,
                    body: file.buffer       
                }
            }, 
            function (err,response) {             
                if (err!=null)
                    reject(err);

                resolve(response.id);                
            });  
    });
}

// GoogleDrive.prototype.getFileId = function(accessToken, refreshToken, fileName) {

//     var self = this;

//     // Retrieve tokens via token exchange explained above or set them:
//     self.oauth2Client.setCredentials({
//         access_token: accessToken,
//         refresh_token: refreshToken
//         // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
//         // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
//     });
  
//     return new Promise(function(resolve,reject) {

//         self.service.files.list({
//             auth: self.oauth2Client,
//             pageSize: 10,
//             q: "name='" + fileName + "'",        
//             fields: "nextPageToken, files(id, name)"
//         }, 
//         function(err, response) {
//             if (err) 
//                 reject(err);
//             else if (response.files.length == 0 || response.files.length > 1) 
//                 resolve(null);
//             else                     
//                 resolve(response.files[0].id);                    
//         });
//     });  
// };

module.exports = GoogleDrive;


