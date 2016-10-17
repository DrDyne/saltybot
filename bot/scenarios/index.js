module.exports = [
  [{
    syntax: /start (\w+) vs (\w+)/, args: ['p1', 'p2'],
    trigger: (msg, p1, p2) => {
      console.log(`so ${p1} and ${p2} wanna play?`)
      // store tmp game
      this.game = {
        p1: p1,
        p2: p2
      }
      console.log('game is on: ${this.game}')
      return Promise.resolve(`game is on: **${p1}** vs **${p2}**\nWho's playing?`)
    },
    answers: ['char :c1 :c2', 'char :c1']
  }, {
    id: 'char :c1 :c2',
    syntax: /!(\w){3} (\w){3}/, args: ['c1', 'c2'],
    trigger: (msg, c1, c2) => {
      console.log('game:', this.game)
      this.game.c1 = c1
      this.game.c2 = c2
      console.log('chargs:', this.game)
      return Promise.resolve('fight !')
    },
    answers: ['score :s1 :s2', 'score :s1']
  }, {
    id: 'score :s1 :s2',
    syntax: /!(\w+) (\w+)/, args: ['s1', 's2'],
    trigger: (msg, s1, s2) => {
      console.log('game:', this.game)
      this.score1 = s1
      this.score2 = s2
      this.resolved = true
      // save game !
      return Promise.resolve('saved')
    }
  }, {
    id: 'char :c1',
    syntax: /!(\w){3}/, args: ['c1']
  }, {
    id: 'score :s1',
    syntax: /!(\w){3}/, args: ['s1']
  }]
]
