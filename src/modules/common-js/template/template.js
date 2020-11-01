; var template;

(function () {
    'use strict';

    template = function (data, template, sign) {
        const s = sign || '%';

        let result = template;

        result = result.replace(new RegExp('<' + s + 'forEach (\\w+)' + s + '>(.*?)<' + s + 'end' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            
            if (!data[p1]) return '';

            return data[p1].map(function(item) {
                let res = p2;

                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        res = res.replace(new RegExp('<' + s + key + s + '>', 'g'), item[key]);
                    }
                }

                return res;
            }).join('');
        });

        result = result.replace(new RegExp('<' + s + 'if (\\w+)' + s + '>(.*?)<' + s + 'endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            if (data[p1] !== '' && data[p1] !== false && data[p1] !== undefined && data[p1] !== null) {
                return p2;
            } else {
                return '';
            }
        });

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<' + s + key + s + '>', 'g'), data[key]);
            }
        }

        return result;
    }
})();