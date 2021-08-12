let data = document.currentScript.getAttribute('data'); //1
console.log(data)
var users = JSON.parse(data);
var _open = XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (method, URL) {
    var _onreadystatechange = this.onreadystatechange,
        _this = this;

    _this.onreadystatechange = function () {
        // catch only completed 'api/2/timeline' requests
        if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf('/api/2/timeline')) {
            try {
                //////////////////////////////////////
                // THIS IS ACTIONS FOR YOUR REQUEST //
                //             EXAMPLE:             //
                //////////////////////////////////////
                var parsed = JSON.parse(_this.responseText);

                let tweets = parsed.globalObjects.tweets;
                var filtered = new Set();
                for (const [key, value] of Object.entries(tweets)) {
                    if (value.user_id_str != users[0]) {
                        filtered.add(key);
                        console.log(key);
                    }
                }
                let entries = parsed.timeline.instructions[0].addEntries.entries;
                loop1:
                for (entry of entries) {
                    if (entry.content.item) {
                        if (filtered.has(entry.content.item.content.tweet.id)) {
                            entry.content.item.content.tweet.displayType = "None";
                        }
                    } else if (entry.content.timelineModule) {
                        loop2:
                        for (item of entry.content.timelineModule.metadata.conversationMetadata.allTweetIds) {
                            if (filtered.has(item)) {
                                entry.content.timelineModule.displayType = "None"
                                break loop2;
                            }
                        }
                    }
                }

                // rewrite responseText
                Object.defineProperty(_this, 'responseText', { value: JSON.stringify(parsed) });
                /////////////// END //////////////////
            } catch (e) { }

            console.log('Caught! :)', method, URL/*, _this.responseText*/);
        }
        // call original callback
        if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
    };

    // detect any onreadystatechange changing
    Object.defineProperty(this, "onreadystatechange", {
        get: function () {
            return _onreadystatechange;
        },
        set: function (value) {
            _onreadystatechange = value;
        }
    });

    return _open.apply(_this, arguments);
};