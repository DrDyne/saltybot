"use strict";
let Moods = require('./moods')

module.exports = class Message {
  constructor (options) {
    this.content = []
    if ( options.text ) this.content.push(options.text)

    this.mood = options.mood
    this.type = options.type
  }

  add (line) {
    this.content.push(line)
  }

  toText () {
    let text = this.content.concat()

    this.addMood(text)
    this.decorate(text)


    console.log(text)
    return text.join('\n')
  }

  map (fn) {
    this.content = this.content.map(fn)
  }

  addMood (text) {
    if ( !this.mood ) return text

    let mood;
    if ( /\w+-\d+/.test(this.mood) ) { // ie: {mood} = wtf-1
      mood = Moods.find((face) => face[0] === this.mood)[1]
    } else { // ie: {mood} = wtf <-- pick a random wtf face
      let moods = Moods.reduce((mem, face) => {
        return ( RegExp(`^${this.mood}`).test(face[0]) ) ? mem.concat(face[1]) : mem
      }, [])

      if ( moods.length === 1 ) mood = moods[0]
      else {
        let randomIndex = this.random(moods.length)
        mood = moods[randomIndex]
      }
    }

    if ( 'md' === this.type ) {
      text.push('')
      text.push(mood)
    } else {
      text[0] = `\`${mood}\` ${text[0]}`
    }

    return text
  }

  decorate (text) {
    if ( 'md' === this.type ) {
      text.unshift('```Markdown')
      text.push('```')
    }

    return text
  }

  random (max) {
    return Math.floor((Math.random() * max) + 1)
  }

}
