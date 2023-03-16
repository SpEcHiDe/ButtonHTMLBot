import { InlineKeyboardButton, InlineQueryResult } from "grammy/types.ts";
import { Bot, Composer, InlineKeyboard } from "grammy/mod.ts";
import { MyContext } from "./myContext.ts";

export const composer = new Composer<MyContext>();

const ADD_NEW_CBDATA = "add_new";
const TEXT_URL_SEPERATOR = "|";

composer.command("start", async (ctx: MyContext) => {
    await ctx.reply("/start");
});

composer
    .filter(
        (ctx) => ctx.message?.chat.type === "private"
    )
    .on(
        [
            ":photo",
            ":video",
            ":animation",
            ":document",
            ":voice",
            ":video_note",
            ":audio",
        ],
        async (ctx: MyContext) => {
            await ctx.copyMessage(
                ctx.message?.chat.id,
                {
                    from_chat_id: ctx.message?.chat.id,
                    message_id: ctx.message?.message_id,
                    caption: ctx.message?.caption,
                    caption_entities: ctx.message?.caption_entities,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "+",
                                    callback_data: ADD_NEW_CBDATA
                                }
                            ]
                        ]
                    },
                    reply_to_message_id: ctx.message?.message_id,
                }
            );
        }
    );


composer.on("callback_query", async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();

    const cbData = ctx.callbackQuery?.data;

    if (cbData === ADD_NEW_CBDATA) {

    }
});


composer
.filter(
    (ctx) => ctx.message?.chat.type === "private"
)
.filter(
    (ctx) => ctx.message?.reply_to_message !== undefined
)
.on(":text", async (ctx: MyContext) => {
    let msgtextparts = ctx.message?.text.split(TEXT_URL_SEPERATOR);
    if (msgtextparts === undefined) {
        return await ctx.reply("INVALID_ONE");
    }
    let currentNewText: string | undefined = "";
    let currentNewUrl: string | undefined = "";
    let isSameLine: boolean = false;
    if (msgtextparts?.length > 1) {
        currentNewUrl = msgtextparts.shift();
        currentNewUrl = currentNewUrl.trim();
        currentNewText = msgtextparts?.join(TEXT_URL_SEPERATOR);
        if (currentNewText.indexOf("|same") > -1) {
            isSameLine = true;
            currentNewText = currentNewText.replace("|same", "");
        }
    }
    let prevReplyMarkup = ctx.message?.reply_to_message?.reply_markup;
    if (prevReplyMarkup === undefined) {
        prevReplyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: currentNewText,
                        url: currentNewUrl
                    }
                ]
            ]
        }
    }
    else {
        let lastNum = prevReplyMarkup.inline_keyboard.length;
        if (isSameLine) {
            prevReplyMarkup.inline_keyboard[lastNum - 1].push({
                text: currentNewText,
                url: currentNewUrl
            });
        }
        else {
            prevReplyMarkup.inline_keyboard.push([{
                text: currentNewText,
                url: currentNewUrl
            }]);
        }
    }
    await ctx.editMessageReplyMarkup({
        chat_id: ctx.message?.chat.id,
        message_id: ctx.message?.reply_to_message.message_id,
        reply_markup: prevReplyMarkup,
    });
});
