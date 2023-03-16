import { InlineKeyboardButton, InlineQueryResult } from "grammy/types.ts";
import { Bot, Composer, InlineKeyboard } from "grammy/mod.ts";
import { MyContext } from "./myContext.ts";
import { CHAR_DOT } from "https://deno.land/std@0.170.0/path/_constants";

export const composer = new Composer<MyContext>();

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
            await ctx.copyMessage(ctx.message?.chat.id, {
                from_chat_id: ctx.message?.chat.id,
                message_id: ctx.message?.message_id,
                caption: ctx.message?.caption,
                caption_entities: ctx.message?.caption_entities,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "+",
                                callback_data: "add_new"
                            }
                        ]
                    ]
                }
            })
        }
    );
