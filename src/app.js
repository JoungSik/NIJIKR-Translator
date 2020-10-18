require("dotenv").config();
const request = require("request");
const Discord = require("discord.js");
const emojiUnicode = require("emoji-unicode");

const axios = require("axios");

const regex = /\@\S+\s+|\<\@\S+\s+/g;

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
      query: query,
    },
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    }
  );

const sendMessage = ({ reaction, query, target }) => {
  getLangCode({ query: query })
    .then((response) => {
      translate({
        source: response.data.langCode,
        target: target,
        query: query,
      })
        .then((response) => {
          reaction.message.channel.send(query);
          reaction.message.channel.send(
            ">>> " + response.data.message.result.translatedText
          );
        })
        .catch((err) => {
          reaction.message.channel.send(query);
          reaction.message.channel.send(
            ">>> " + err.response.data.errorMessage
          );
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.once("ready", () => {
  console.log("Ready!");
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

  // 한국어
  if (emojiUnicode(reaction.emoji.name) === "1f1f0 1f1f7") {
    const query = reaction.message.content.replace(regex, "");
    sendMessage({ reaction: reaction, query: query, target: "ko" });
  }

  // 일본어
  if (emojiUnicode(reaction.emoji.name) === "1f1ef 1f1f5") {
    const query = reaction.message.content.replace(regex, "");
    sendMessage({ reaction: reaction, query: query, target: "ja" });
  }

  // 영어
  if (emojiUnicode(reaction.emoji.name) === "1f1fa 1f1f8") {
    const query = reaction.message.content.replace(regex, "");
    sendMessage({ reaction: reaction, query: query, target: "en" });
  }
});

client.login(process.env.TOKEN);
