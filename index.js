import through from 'through'

export default class FlowRegulator {
  constructor (options) {
    this.maxConcurrent = options.max
    this.active = 0
  }

  start () {
    let regulator = this

    return through(function write(data) {
      regulator.stream = this
      if (++regulator.active >= regulator.maxConcurrent) {
        regulator.stream.pause()
      }
      this.emit('data', data)
    })
  }

  end () {
    let regulator = this

    return through(function write(data) {
      regulator.active--
      regulator.stream.resume()
      this.emit('data', data)
    })
  }
}
