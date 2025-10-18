require("dotenv").config()
const { inlineKeyboard } = require("telegraf/markup")
const searchImage = require("./searchImages")
const { Telegraf } = require("telegraf")
const { BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
  return ctx.replyWithMarkdownV2(
    "Welcome to Image Inline Bot\\!\nJust type in any chat @images002bot \\<image\\-name\\> and you will recieve some images"
  )
})

bot.on("inline_query", async (ctx) => {
  const query = ctx.inlineQuery.query
  if (!query) return ctx.answerInlineQuery([], { cache_time: 0 })

  try {
    const result = await searchImage(query) // returns full axios response
    const hits = result.data.hits 

    const data = hits
      .map((hit) => {
        // build a Telegram-friendly CDN image URL
        const cdn640 = typeof hit.previewURL === "string"
          ? hit.previewURL.replace("_150.", "_640.")
          : null
        const photoUrl = cdn640

        return {
          type: "photo",
          id: String(hit.id),
          photo_url: photoUrl,              
          thumbnail_url: hit.previewURL,    
          title: hit.tags,
          description: hit.tags,
          input_message_content: {
            message_text: hit.pageURL
          },
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `${hit.likes} likes`,
                  url: hit.pageURL
                }
              ],
              [
                {
                  text: "Share a bot",
                  switch_inline_query: ""
                }
              ]
            ]

          }
        }
      })
      

    await ctx.answerInlineQuery(data, { cache_time: 0 })
  } catch (err) {
    console.error("Error answering inline query:", err)
  }
})

bot.launch()
