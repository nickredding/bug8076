var http = (window.Capacitor ? window.Capacitor.Plugins.CapacitorHttp : null),
    cookies = (window.Capacitor ? window.Capacitor.Plugins.CapacitorCookies : null),
    cookieData = (window.Capacitor ? window.Capacitor.Plugins.CapacitorCookieData : null);

function outputResult(id, data) {
    if ($('#' + id).html()) {
        $('#' + id).html('');
    }
    $('#' + id).hide();
    $('#' + id).html(data);
    $('#' + id).slideDown();
}

function ajaxpostdata() {
    $.ajax('https://onlinenewsreader.net/bug6792/echopost.php', {method:'POST', data: {a:'x',b:'y'},
    success(response) {
        outputResult('ajaxpostdata', response);
    }});
}

function capacitorpostdata() {
   http.request({method: 'POST', url: 'https://onlinenewsreader.net/bug6792/echopost.php', headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8', Accept: '*/*'}, data: {a:'x',b:'y'}})
   .then(
    function(response) {
        outputResult('capacitorpostdata', response.data);
    }
   );
}

function capacitorpostdatastring() {
   http.request({method: 'POST', url: 'https://onlinenewsreader.net/bug6792/echopost.php', headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8', Accept: '*/*'}, data:"a=x&b=y"})
   .then(
    function(response) {
        outputResult('capacitorpostdatastring', response.data);
    }
   );
}

function testget(url, params, complete) {
    var options = {url: url, params: params};
    http.get(options).then(
        function(returnData) {
            var output = '<hr>GET ' + url + (params ? '<br/>params=' + JSON.stringify(params).split(',').join(',<br/>&nbsp;') : '') + '<br/>' + returnData.data;
            if (returnData.headers) {
                if (returnData.headers['Set-Cookie']) {
                    output += '<br/>Cookie headers returned:<br>';
                }
                for (h in returnData.headers) {
                    if (h === 'Set-Cookie') {
                        output += '<br/>Set-Cookie: ' + returnData.headers[h];
                    }
                }
            }
            complete(output + '</hr><br/>');
        }
    ).catch(
        function(reason) {
            complete('ERROR: GET ' + url + ' ' + reason);
        }
    )
}

function testpost(url, params, data, headers, complete) {
    var options = {url: url, params: params, data: data, headers: headers},
        h;
    http.post(options).then(
        function(returnData) {
            var output = '<hr>POST ' + url + '<br/>post data=' + JSON.stringify(data) + '<br/>' + returnData.data;
            if (returnData.headers) {
                if (returnData.headers['Set-Cookie']) {
                    output += '<br/>Cookie headers returned:<br>';
                }
                for (h in returnData.headers) {
                    if (h === 'Set-Cookie') {
                        output += '<br/>Set-Cookie: ' + returnData.headers[h];
                    }
                }
            }
            complete(output + '</hr><br/>');
        }
    ).catch(
        function(reason) {
            complete('ERROR: GET ' + url + ' ' + reason);
        }
    );
}

function setremotecookie(key, value, url, secure, complete) {
    var params = { setcookiekey: key, setcookievalue: value, permanentcookie: '1' };
    if (secure) {
        params.secure = true;
    }
    testget(url, params, complete);
}

function postremotecookie(key, value, url, secure, complete) {
    var data = { setcookiekey: key, setcookievalue: value, permanentcookie: '1' };
    if (secure) {
        data.secure = true;
    }
    testpost(url, {}, data, {'Content-Type' : 'application/x-www-form-urlencoded'}, complete);
}

function postnumber() {
    testpost('https://www.onlinenewsreader.net/bug6792/echo.php', {}, {number: 1234}, { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        function(result) {
            $('#postnumberdata').html(result);
        }
    );
}

function deleteremotecookie(key, url, complete) {
    var params = { deletecookie: key };
    testget(url, params, complete);
}

function capacitorurlcookies() {
    var output = '';
    cookies.clearAllCookies()
    .then(
        function () {
            output = '<br/>All cookies cleared, document.cookie = ' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
            output += 'Setting cookie for domain onlinenewsreader.net via server request<br/><br/>';
            setremotecookie('nrkey1', 'nrvalue1', 'https://onlinenewsreader.net/echo.php', false,
                function(data) {
                    output += '<strong>Output:</strong><br/><em>' + data + '</em><br/><br/>';
                    output += 'Setting cookie for domain onlinenewsreader.net via server request<br/><br/>';
                    setremotecookie('onrkey1', 'onrvalue1', 'https://www.onlinenewsreader.net/echo.php', false,
                        function(data) {
                            output += '<strong>Output:</strong><br/><em>' + data + '</em><br/><br/>';
                            output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
                            output += 'Retrieving cookies for domain onlinenewsreader.net<br/><br/>';
                            cookies.getCookies({url:'onlinenewsreader.net'})
                            .then(
                                function(data) {
                                    output += '<strong>Result:</strong><br/>' + JSON.stringify(data).split(',').join(',<br/>&nbsp;') + '<br/><br/>';
                                    output += 'Retrieving cookies for domain onlinenewsreader.net<br/><br/>';
                                    cookies.getCookies({url:'www.onlinenewsreader.net'})
                                    .then(
                                        function(data) {
                                            output += '<strong>Result:</strong><br/>' + JSON.stringify(data).split(',').join(',<br/>&nbsp;') + '<br/><br/>';
                                            outputResult('capacitorurlcookies', output);
                                        }
                                    )
                                }
                            )
                        });
                });
        });
}

function getcookieexpiry() {
    var cookieList = document.cookie.split(';'),
        output = '',
        i,
        count;
    if (/^ *$/.test(document.cookie)) {
        outputResult('getcookieexpiry', 'There are no cookies in document.cookie');
        return;
    }
    count = cookieList.length;
    for (i=0; i < cookieList.length; i++) {
        var cookieDetails = cookieList[i].split('=');
        var name = cookieDetails[0].replace(/^ *([^ ]*) *$/, '$1');
        var url = (/^nr/.test(name) ? 'https://onlinenewsreader.net' : 'https://www.onlinenewsreader.net');
        cookieData.getCookieExpiry({value: name, url: url})
        .then(
            function(result) {
                output += '<br>'+result.value.replace(/Expiry/, '<br/>&nbsp;&nbsp;Expiry');
                if (--count === 0) {
                    outputResult('getcookieexpiry', output);
                }
            }
        )
    }
}

function setonrcookie() {
    var output = 'Clearing all cookies and setting cookie onrsetkey1=onrsetvalue1 at https://www.onlinenewsreader.net<br/><br/>';
    cookies.clearAllCookies()
    .then(
        function () {
            cookies.setCookie({url: 'https://www.onlinenewsreader.net', key: 'onrsetkey1', value: 'onrsetvalue1', path: '/', expires: 'Sat, 02 Sep 2024 16:17:50 GMT'})
            .then(
                function() {
                    output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
                    output += 'Setting cookie nrsetkey1=nrsetvalue1 at https://onlinenewsreader.net<br/><br/>';
                    cookies.setCookie(({url:'https://onlinenewsreader.net', key: 'nrsetkey1', value: 'nrsetvalue1', path: '/', expires: 'Sat, 02 Sep 2024 16:17:50 GMT'}))         
                    .then(
                        function() {
                            output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
                            output += 'Retrieving cookies for domain onlinenewsreader.net (for Android this is just listing document.cookie unless the fix has been applied)<br/><br/>';
                            cookies.getCookies({url:'www.onlinenewsreader.net'})
                            .then(
                                function(data) {
                                    output += '<strong>Result:</strong><br/>' + JSON.stringify(data).split(',').join(',<br/>&nbsp;') + '<br/><br/>';
                                    testget('https://www.onlinenewsreader.net/echo.php', null,
                                        function(result) {
                                            output += '<br/><br/>Checking with Http.get (onrsetkey1 is shown as a received cookie)<br/><em>'+ result + '</em><br/>';
                                            cookies.clearCookies({url: 'onlinenewsreader.net'})
                                            .then(
                                                function() {
                                                    output += '<br/><br/>Clearing cookies for onlinenewsreader.net<br/><br/>';
                                                    output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
                                                    testget('https://onlinenewsreader.net/echo.php', null,
                                                        function(result) {
                                                            output += '<br/><br/>Checking with Http.get<br/><em>'+ result + '</em><br/>';
                                                            outputResult('setonrcookie', output);
                                                    });
                                                }
                                            );
                                    });
                                }
                            );
                        }
                    );
                });
        });
}


function deleteonrcookie() {
    var output = 'Deleting cookie onrsetkey1 at https://www.onlinenewsreader.net<br/><br/>';
    output += '<strong>document.cookie before deletion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
    cookies.deleteCookie({url: 'https://www.onlinenewsreader.net', key: 'onrsetkey1'})
    .then(
        function() {
            output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
            output += 'Retrieving cookies for domain onlinenewsreader.net (for Android this is just listing document.cookie unless the fix has been applied)<br/><br/>';
            cookies.getCookies({url:'www.onlinenewsreader.net'})
            .then(
                function(data) {
                    output += '<strong>Result:</strong><br/>' + JSON.stringify(data).split(',').join(',<br/>&nbsp;') + '<br/><br/>';
                    testget('https://www.onlinenewsreader.net/echo.php', null,
                        function(result) {
                            output += '<br/><br/>Checking with Http.get (onrsetkey1 not seen)<br/><em>'+ result + '</em><br/>';
                            outputResult('deleteonrcookie', output);
                    });
                }
            );
        }
    );
}

function sethttponly() {
    var params = { setcookiekey: 'onrhttponlykey1', setcookievalue: 'onrhttponlyvalue1', permanentcookie: '1' , httponly: '1', secure: '1'};
    var output = '<strong>document.cookie prior to server invocation:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
    output += 'Setting cookie onrhttponlykey1 with HttpOnly parameter<br/><br/>'; 
    testget('https://www.onlinenewsreader.net/echo.php', params, 
    function(data) {
        output += '<strong>Output:</strong><br/><em>' + data + '</em><br/><br/>';
        output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
        testget('https://www.onlinenewsreader.net/echo.php', null,
            function(result) {
                output += '<br/><br/>Checking with Http.get<br/><em>'+ result + '</em><br/>';
                outputResult('sethttponly', output);
        });
    });

}


function setwithdomain() {
    var params = { setcookiekey: 'onrnrdomainkey1', setcookievalue: 'onrnrdomainvalue1', permanentcookie: '1' , domain: 'onlinenewsreader.net', secure: '1'};
    var output = '<strong>document.cookie prior to server invocation:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
    testget('https://www.onlinenewsreader.net/echo.php', params, 
    function(data) {
        output += 'Setting cookie with domain onlinenewsreader.net<br/><strong>Output:</strong><br/><em>' + data + '</em><br/><br/>';
        output += '<strong>document.cookie upon completion:</strong><br/>' + (!/^ *$/.test(document.cookie) ? document.cookie : '""') + '<br/><br/>';
        outputResult('setwithdomain', output);
    });

}