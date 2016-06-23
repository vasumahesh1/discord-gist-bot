var Discord = require('discord.js');
var nconf = require('nconf');
var rp = require('request-promise');

var gist = require('./lib/gist.js');

nconf.argv()
  .env()
  .file('user', 'config/user.json')
  .file('defaults', 'config/default.json');

var botId = nconf.get('botId');

var botMention = '<@' + botId + '>'

var bot = new Discord.Client();

bot.on('message', function(message) {
  if (message.isMentioned(botId)) {

    message.content = message.content.replace(botMention, '');
    message.content = message.content.trim();

    var url = gist.GetRaw(message.content);

    if (!url) {
      return bot.reply(message, 'Wrong URL, Check it again.');
    }

    rp(url)
      .then(function(htmlString) {
        var md = '```\n';
        md += htmlString;
        md += '\n```\n';

        bot.sendMessage(message.channel, md, undefined, function(err) {
          if (err) {
            console.log('Message Send Error', err);
          }
        });
      })
      .catch(function(err) {
        console.log('Error Getting Gist', err);
      });
  }
});

bot.on('ready', function() {
  console.log('Bot is ready');
});

bot.on('error', function() {
  console.log('Bot Error', arguments);
});

bot.on('disconnected', function() {
  console.log('Bot Disconnected');
});

bot.loginWithToken(nconf.get('token'));
