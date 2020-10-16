require("dotenv").config();
const request = require("request");
const Discord = require("discord.js");
const emojiUnicode = require("emoji-unicode");

const axios = require("axios");

const translate = ({ source, target, query }) =>
  axios.post(
    "https://openapi.naver.com/v1/papago/n2mt",
    {
      source: source,
      target: target,
      text: query,
    },
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    }
  );

const getLangCode = ({ query }) =>
  axios.post(
    "https://openapi.naver.com/v1/papago/detectLangs",
    {
      query: query
    },
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    }
  );



const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  // console.log(message.content);
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }

  if (message.react === ":flag_kr:") {
    message.channel.send("KOR");
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message: ", error);
      return;
    }
  }
  if (emojiUnicode(reaction.emoji.name) === "1f1f0 1f1f7") {
    // 한국어
    // reaction.message.channel.send("KOR");
    var query = reaction.message.content;
    getLangCode({query: query})
      .then((response) => {
        console.log(response.data.langCode);
        translate({ source: response.data.langCode, target: "ko", query: query })
        .then((response) => {
          reaction.message.channel.send(
            response.data.message.result.translatedText
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    })
  }

  if (emojiUnicode(reaction.emoji.name) === "1f1ef 1f1f5") {
    //일본어
    var query = reaction.message.content;
    getLangCode({query: query})
      .then((response) => {
        console.log(response.data.langCode);
        translate({ source: response.data.langCode, target: "ja", query: query })
        .then((response) => {
          reaction.message.channel.send(
            response.data.message.result.translatedText
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    })
  }

  if (emojiUnicode(reaction.emoji.name) === "1f1fa 1f1f8") {
    //영어
    var query = reaction.message.content;
    getLangCode({query: query})
      .then((response) => {
        console.log(response.data.langCode);
        translate({ source: response.data.langCode, target: "en", query: query })
        .then((response) => {
          reaction.message.channel.send(
            response.data.message.result.translatedText
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    })
  }

  //console.log(`${reaction.codePointAt(0).toString(16)}'`);
  //console.log(`${reaction.emoji.toString()}'`);
  //console.log(emojiUnicode("📻"));
  // console.log(emojiUnicode(reaction.emoji.name));
  // console.log(
  //   `${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`
  // );
  // console.log(
  //   `${reaction.count} user(s) have given the same reaction to this message!`
  // );
});

client.login(process.env.TOKEN);

// var query = "번역할 문장을 입력하세요.";

// app.get("/translate", function (req, res) {
//   var api_url = "https://openapi.naver.com/v1/papago/n2mt";
//   var request = require("request");
//   var options = {
//     url: api_url,
//     form: { source: "ko", target: "en", text: query },
//     headers: {
//       "X-Naver-Client-Id": client_id,
//       "X-Naver-Client-Secret": client_secret,
//     },
//   };
//   request.post(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
//       res.end(body);
//     } else {
//       res.status(response.statusCode).end();
//       console.log("error = " + response.statusCode);
//     }
//   });
// });

// app.listen(3000, function () {
//   console.log("http://127.0.0.1:3000/translate app listening on port 3000!");
// });
