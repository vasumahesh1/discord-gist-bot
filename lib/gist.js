var url = require('url');

module.exports.GetRaw = GetRaw;

function GetRaw(input) {
  var index = input.indexOf('gist.github.com');

  if (index === -1) {
    input = 'gist.github.com/' + input;
  }

  var parsed = url.parse(input);
  var pathname = parsed.pathname;
  var splits = pathname.split('/');

  if (splits.length !== 3) {
    return null;
  }

  var username = splits[1];
  var gistId = splits[2];

  var rawUrl = 'https://gist.githubusercontent.com';
  rawUrl = [rawUrl, username, gistId, 'raw'].join('/');

  return rawUrl;
}
