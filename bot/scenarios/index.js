let Message = require('../message')

module.exports = [
  [{
    syntax: /start (\w+) vs (\w+)/, args: ['p1', 'p2'],
    trigger: (msg, options) => {
      console.log(`so ${options.p1} and ${options.p2} wanna play?`)
      // store tmp game
      this.game = {
        p1: options.p1,
        p2: options.p2
      }
      console.log(`game is on: ${JSON.stringify(this.game, null, 2)}`)

      let answer = new Message({
        text: `game is on: **${options.p1}** vs **${options.p2}**\nWho's playing?`,
        mood: 'wtf-1',
      })

      console.log(answer)
      return Promise.resolve(answer.toText())
    },
    answers: ['char :c1 :c2', 'char :c1']

  }, {
    id: 'char :c1 :c2',
    syntax: /(\w{3}) (\w{3})/, args: ['c1', 'c2'],
    trigger: (msg, options) => {
      console.log('game:', this.game)
      this.game.c1 = options.c1
      this.game.c2 = options.c2
      console.log('chargs:', this.game)
      return Promise.resolve('\`(ง’̀-‘́)ง\` Fight !')
    },
    answers: ['score :s1 :s2', 'score :s1']

  }, {
    id: 'score :s1 :s2',
    syntax: /(\d) (\d)/, args: ['s1', 's2'],
    trigger: (msg, options) => {
      this.game.score1 = options.s1
      this.game.score2 = options.s2
      // save game !
      console.log(this.game)
      let answer = new Message({mood: 'done'})
      answer.add(`**${this.game.p1}** :${this.game.c1}: vs **${this.game.p2}** :${this.game.c2}:`)
      answer.add(`${this.game.score1} - ${this.game.score2}`)
      return Promise.resolve(answer.toText())
    }

  }, {
    id: 'char :c1',
    syntax: /(\w{3})/, args: ['c1'],
    trigger: (msg, options) => {
      this.game.c1 = options.c1
      return Promise.resolve(`\`ლ(ಠ益ಠ)ლ\` What about **${this.game.p2}**?`)
    },
    answers: ['char :c2']

  }, {
    id: 'char :c2',
    syntax: /(\w{3})/, args: ['c2'],
    trigger: (msg, options) => {
      this.game.c2 = options.c2
      return Promise.resolve('\`(ง’̀-‘́)ง\` Fight !')
    },
    answers: ['score :s1 :s2', 'score :s1']

  }, {
    id: 'score :s1',
    syntax: /\d/, args: ['s1'],
    trigger: (msg, options) => {
      this.game.score1 = options.s1
      return Promise.resolve(`\`ლ(ಠ益ಠ)ლ\` What about **${this.game.p2}**?`)
    },
    answers: ['score :s2']

  }, {
    id: 'score :s2',
    syntax: /\d/, args: ['s2'],
    trigger: (msg, options) => {
      this.game.score2 = options.s2
      return Promise.resolve('\`s( ^ ‿ ^)-b\`')
    }
  }],
]
