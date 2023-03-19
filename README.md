## [ButtonHTMLBot](https://ButtonHTMLBot.t.me/?start=GitHub)

## 🤔 Why this bot ?

Telegram API does not have the concept of `parse_mode` or the simplicity / helper which the **wizard** of [`telegram-bot-api` server](https://github.com/tdlib/td/blob/70bee089d492437ce931aa78446d89af3da182fc/td/telegram/Td.cpp#L8596-L8608) had created. To the Telegram server, it is `text` and `entities`. Hence, this project attempts to create buttons without using the `parse_mode` helpers, but use the InlineKeyboardButton that the Telegram API provides, and saves the resulting `reply_markup` without the need to convert / store another third format and hence reduce the burden of maintainability.

## Projects using this Technique

- **@IMDbOT**: check `/custom_template_help` command
- **@NoPMsBot**: check `/start` in the #General topic


If you are having issues with this library, or if you like to suggest something that can make this library better, please open [an issue](https://github.com/SpEcHiDe/ButtonHTMLBot/issues) here. Or if you'd like to contribute, please open [a pull request](https://github.com/SpEcHiDe/ButtonHTMLBot/pulls).

