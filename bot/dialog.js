"use strict";
module.exports = class Dialog {
  constructor (user, msg, Scenario) {
    if ( !Scenario ) throw 'Cannot create Dialog without Scenario'
    this.user = user
    this.msg = msg
    this.scenario = Scenario
    this.currentNode = Scenario[0]
    this.ticks = 0
    this.started = false
    this.resolved = false
  }

  get with () { return this.msg.author.username }
  get at () { return this.msg.channel.id }

  tick (msg) {
    console.log('tick');
    console.log(this.currentNode)

    if ( !this.started ) {
      this.started = true
      let args = [].concat(msg, this.parse(msg.cleanContent, this.currentNode))
      return this.currentNode.trigger.apply(this, args)
    } else  {
      let node;
      let validAnswer = this.currentNode.answers.find((answer) => {
        node = this.scenario.find((s) => s.id === answer)
        return node && this.parse(msg.content, node)
      })

      if ( !validAnswer ) return Promise.resolve()

      this.currentNode = node
      console.log('new node')
      console.log(this.currentNode)
      let args = [].concat(msg, this.parse(msg.cleanContent, this.currentNode))
      return this.currentNode.trigger.apply(this, args)
    }
  }

  parse (content, scenarioNode) {
    let args = content.match(scenarioNode.syntax)
    if ( !args ) return null

    args.shift()
    return args

    //return scenarioNode.args.reduce((memo, name, index) => {
    //  memo[name] = args[index+1]
    //  return memo
    //}, {})
  }
}

