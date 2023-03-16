import { InlineKeyboardButton, InlineQueryResult } from "grammy/types.ts";
import { Bot, Composer, InlineKeyboard } from "grammy/mod.ts";
import { MyContext } from "./myContext.ts";

export const composer = new Composer<MyContext>();

composer.command("start", async (ctx: MyContext) => {
    await ctx.reply("/start");
});
