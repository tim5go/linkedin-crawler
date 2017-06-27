var fs      = require('fs');
var phantom = require('phantom');
var cheerio = require('cheerio');
var profile = require('../lib/profile');
var sitepage = null;
var phInstance = null;

var url = 'https://www.linkedin.com/in/lilian-guan-a68a2b51';
var htmlSavePath = __dirname + '/Lilian_Guan_LinkedIn.html'
var jSonSavePath = __dirname + '/Lilian_Guan_LinkedIn.json'

var tr = require('tor-request');

tr.newTorSession(function(err, body){
			console.log("err: " + err);
			console.log("body: " + body);			
		}
	);

//['--proxy=127.0.0.1:9050','--proxy-type=socks5']
    phantom 
        .create()
        .then(function(instance) {
            phInstance = instance;
            return instance.createPage();
        })
        .then(function(page) {
            sitepage = page;
            page.setting('userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36');
            return page.open(url);
        })
        .then(function(status) {
            console.log(status)
            return sitepage.property('content');
        })
        .then(function (body) {
            console.log(body);
			fs.writeFile (htmlSavePath, body, function(err) {
				if (err) throw err;
					console.log('complete');
				
				
				fs.exists(htmlSavePath, function(exists){
					if(exists){
						fs.readFile(htmlSavePath , function(err, html) {
							profile(url, html, function(err, data){
								console.log(JSON.stringify(data, null, 2));
	
								fs.writeFile (jSonSavePath, JSON.stringify(data, null, 2), function(err) {
									if (err) throw err;
									console.log('complete');
								});
							})
						});
						
					};
				});
				
				
			});
            sitepage.close();
            phInstance.exit();
        })
        .catch(function(err) {
            console.log(err);
            phInstance.exit();
        });
		
		
