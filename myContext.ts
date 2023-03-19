import { Context } from "grammy/mod.ts";

interface BotConfig {
    botDeveloper: number;
    botToken: string;
}

// https://t.me/grammyjs/116198

export type MyContext = Context & {
    botConfig: BotConfig;
};
