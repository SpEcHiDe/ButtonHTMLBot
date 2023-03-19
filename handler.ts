import { Composer } from "grammy/mod.ts";
import { MyContext } from "./myContext.ts";

export const composer = new Composer<MyContext>();

const TEXT_URL_SEPERATOR = "|";
const SAME_URL_SEPERATOR = "|same";
const INVALID_MESSAGE = `🧎‍♂️ help  🤲

<i>Whoops</i>.

You seem to have messed up the format for sending messages and
should have a look at the <a href='https://github.com/SpEcHiDe/ButtonHTMLBot'>help documents</a>.`;

const START_MESSAGE =
    `This is a new experience 💯 for easily creating buttons, inside your Telegram Chats, without opening third-party webpages.

<b>Bots using this technique</b>

<b>@IMDbOT</b>: check <code>/custom_template_help</code> command
<b>@NoPMsBot</b>: check <code>/start</code> in the #General topic`;

composer.command("start", async (ctx: MyContext) => {
    await ctx.reply(START_MESSAGE, {
        reply_to_message_id: ctx.message?.message_id,
        parse_mode: "HTML",
        disable_web_page_preview: true,
    });
});

composer.on("callback_query", async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();
});

composer
    .filter(
        (ctx) => ctx.message?.chat.type === "private",
    )
    .filter(
        (ctx) => ctx.message?.reply_to_message !== undefined,
    )
    .on(":text", async (ctx: MyContext) => {
        if (ctx.message?.text === undefined) {
            return await ctx.reply(INVALID_MESSAGE, {
                parse_mode: "HTML",
                disable_web_page_preview: true,
            });
        }
        const msgtextparts = ctx.message?.text.split(TEXT_URL_SEPERATOR);
        if (msgtextparts === undefined) {
            return await ctx.reply(INVALID_MESSAGE, {
                parse_mode: "HTML",
                disable_web_page_preview: true,
            });
        }
        let currentNewText: string | undefined = "";
        let currentNewUrl: string | undefined = "";
        let isSameLine = false;
        if (msgtextparts?.length > 1) {
            currentNewUrl = msgtextparts.shift();
            currentNewUrl = currentNewUrl?.trim();
            currentNewText = msgtextparts?.join(TEXT_URL_SEPERATOR);
            if (currentNewText.toLowerCase().indexOf(SAME_URL_SEPERATOR) > -1) {
                isSameLine = true;
                currentNewText = currentNewText.replace(
                    SAME_URL_SEPERATOR.toUpperCase(),
                    "",
                );
                currentNewText = currentNewText.replace(
                    SAME_URL_SEPERATOR.toLowerCase(),
                    "",
                );
            }
        }
        if (currentNewUrl?.trim() === "") {
            return await ctx.reply(INVALID_MESSAGE, {
                parse_mode: "HTML",
                disable_web_page_preview: true,
            });
        }
        let prevReplyMarkup = ctx.message?.reply_to_message?.reply_markup;
        if (prevReplyMarkup === undefined) {
            prevReplyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: currentNewText,
                            url: currentNewUrl,
                        },
                    ],
                ],
            };
        } else {
            const lastNum = prevReplyMarkup.inline_keyboard.length;
            if (isSameLine) {
                prevReplyMarkup.inline_keyboard[lastNum - 1].push({
                    text: currentNewText,
                    url: currentNewUrl,
                });
            } else {
                prevReplyMarkup.inline_keyboard.push([{
                    text: currentNewText,
                    url: currentNewUrl,
                }]);
            }
        }
        await ctx.copyMessage(
            ctx.message?.chat.id,
            {
                from_chat_id: ctx.message?.chat.id,
                message_id: ctx.message?.reply_to_message.message_id,
                caption: ctx.message?.reply_to_message.caption,
                caption_entities:
                    ctx.message?.reply_to_message.caption_entities,
                reply_to_message_id: ctx.message?.message_id,
                reply_markup: prevReplyMarkup,
            },
        );
    });
