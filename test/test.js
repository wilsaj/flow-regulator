import es from 'event-stream'
import FlowRegulator from '../index.js'

const start = 0
const end = 30

let arr = []

for (let i = start; i < end; i++) {
  arr.push(i)
}

let regulator = new FlowRegulator({max: 7})

es.readArray(arr)
  .pipe(regulator.start())
  .pipe(es.map((data, cb) => {
    setTimeout(() => {
      cb(null, `${data}\n`)
    }, 1000)
  }))
  .pipe(regulator.end())
  .pipe(es.map((data, cb) => {
    cb(null, data)
  }))
  .pipe(process.stdout)
