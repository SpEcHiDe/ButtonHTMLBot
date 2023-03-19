// Telegram Constants
export const TG_MAX_MESSAGE_LENGTH = 4096;
export const TG_MAX_CAPTION_LENGTH = 1024;

export const TG_ALLOWED_UPDATES = [
    "message",
    "edited_message",
    "channel_post",
    "edited_channel_post",
    "inline_query",
    "chosen_inline_result",
    "callback_query",
    "poll",
    "poll_answer",
    "my_chat_member",
    "chat_member",
    "chat_join_request",
];

export const TG_ENV_S = Deno.env.toObject();
