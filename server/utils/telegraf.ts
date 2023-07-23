import { Telegraf } from 'telegraf'

let _bot: Telegraf

export const useTelegraf = () => {
  if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN is required')
  }

  if (!_bot) {
    _bot = new Telegraf(process.env.BOT_TOKEN)
    _bot.launch()

    process.once('SIGINT', () => _bot.stop('SIGINT'))
    process.once('SIGTERM', () => _bot.stop('SIGTERM'))
  }

  return _bot
}
