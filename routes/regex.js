var regex
var banedUsers

exports.getRegex = function () {
    return regex;
};

exports.setRegex = function (string) {
    regex = new RegExp(string, 'i');
};

exports.getBannedUsers = function () {
    return banedUsers;
};

exports.setBannedUsers = function (list) {
    banedUsers = list;
};

