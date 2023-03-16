import { Context } from "grammy/web";

interface BotConfig {
    botDeveloper: number;
    botToken: string;
    botHost: string;
}

// https://t.me/grammyjs/116198

export type MyContext = Context & {
    botConfig: BotConfig;
};