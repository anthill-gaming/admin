function ws_url(path) {
    if (/^http:.*/.test(path)) {
        return path.replace(/^http/, 'ws')
    } else if (/^https:.*/.test(path)) {
        return path.replace(/^https/, 'wss')
    } else {
        var _url = void 0;
        // Use wss:// if running on https://
        var scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
        var base_url = scheme + '://' + window.location.host;
        if (path === undefined) {
            _url = base_url;
        } else {
            // Support relative URLs
            if (path[0] === '/') {
                _url = '' + base_url + path;
            } else {
                _url = path;
            }
        }
        return _url
    }
}