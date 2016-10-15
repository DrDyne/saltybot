"use strict";

module.exports = class Message {
  constructor (type) {
    this.type = type
    this.content = []
  }

  add (line) {
    this.content.push(line)
  }

  toText () {
    var text = this.content.concat()

    if ( 'md' === this.type ) {
      text.unshift('```Markdown')
      text.push('```')
    }

    return text.join('\n')
  }

  map (fn) {
    this.content = this.content.map(fn)
  }

  mapCharToEmoji (line) {
    return characters.reduce((line, char) => {
      return line.replace(RegExp('char:'+char.id), ':'+char.code+':')
    }, line)
  }


}
