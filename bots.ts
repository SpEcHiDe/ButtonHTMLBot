import { Bot, GrammyError, HttpError } from "grammy/mod.ts";
import { TG_ENV_S } from "./consts.ts";
import { MyContext } from "./myContext.ts";

const bots = new Map<string, Bot<MyContext>>();

export function getBot(token: string) {
    let bot = bots.get(token);
    if (!bot) {
        try {
            bot = new Bot<MyContext>(token, {
                // botInfo: {},
                client: {
                    // We accept the drawback of webhook replies for typing status.
                    canUseWebhookReply: (method) => method === "sendChatAction",
                },
            });
            bot.use(async (ctx, next): Promise<void> => {
                // take time before
                // const before = Date.now(); // milliseconds
                // set token attribute
                ctx.botConfig = {
                    botDeveloper: parseInt(TG_ENV_S.OWCID),
                    botToken: token,
                };
                // invoke downstream middleware
                await next(); // make sure to `await`!
                // take time after
                // const after = Date.now(); // milliseconds
                // log difference
                // console.log(`Response time: ${after - before} ms`);
            });
            // https://grammy.dev/guide/errors.html#catching-errors
            bot.catch((err) => {
                const ctx = err.ctx;
                console.error("Error while handling update ", ctx.update);
                const e = err.error;
                if (e instanceof GrammyError) {
                    console.error("Error in request:", e.description);
                } else if (e instanceof HttpError) {
                    console.error("Could not contact Telegram:", e);
                } else {
                    console.error("Unknown error:", e);
                }
            });
            // save the token
            bots.set(token, bot);
        } catch (_e) {
            // console.log(_e);
        }
    }
    return bot;
}
