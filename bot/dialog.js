"use strict";
class Dialog {
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
      let args = this.parse(msg.cleanContent, this.currentNode)
      return this.currentNode.trigger(msg, args)

    } else  {
      let node; // dialog node containing a syntax matching user input
      let validAnswer = this.currentNode.answers.find((answer) => {
        node = this.scenario.find((s) => s.id === answer) // find node
        return node && this.parse(msg.content, node)
      })

      if ( !validAnswer ) return Promise.resolve()

      this.currentNode = node
      let args = this.parse(msg.cleanContent, this.currentNode)

      return this.currentNode.trigger(msg, args)
      .then((response) => {
        if ( !this.currentNode.answers ) { // last node, end dialog
          console.log('nothing to answer, ending dialog')
          this.resolved = true;
        }

        return response
      })
    }
  }

  parse (content, scenarioNode) {
    let args = content.match(scenarioNode.syntax)
    if ( !args ) return null

    return scenarioNode.args.reduce((memo, name, index) => {
      memo[name] = args[index+1]
      return memo
    }, {})
  }
}
