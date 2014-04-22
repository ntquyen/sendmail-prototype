angular.module('appUtils', []).service('appUtils', function() {
    return {
        // bold the search term in the results
        boldText: function(searchTerm, text) {
            var keywords = searchTerm.split(" ");
            var markup = "";
            if (text) {
                markup = text;
                for (var i = keywords.length - 1; i >= 0; i--) {
                    markup = markup.replace(keywords[i], "<strong>" + keywords[i] + "</strong>");
                }
            }
            return markup;
        }
    };
});