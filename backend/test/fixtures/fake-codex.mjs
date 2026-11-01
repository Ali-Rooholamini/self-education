import { createInterface } from 'node:readline'
import process from 'node:process'
const send = (value) => process.stdout.write(`${JSON.stringify(value)}\n`)
createInterface({ input: process.stdin }).on('line', (line) => {
  const request = JSON.parse(line)
  if (request.id === undefined) return
  if (request.method === 'initialize')
    send({ id: request.id, result: { userAgent: 'test' } })
  else if (request.method === 'account/read')
    send({
      id: request.id,
      result: { account: { type: 'chatgpt', planType: 'test' } },
    })
  else if (request.method === 'test/notification') {
    send({
      method: 'item/agentMessage/delta',
      params: { threadId: 'test-thread', itemId: 'test-item', delta: 'سلام' },
    })
    send({ id: request.id, result: {} })
  } else
    send({
      id: request.id,
      error: { code: -32601, message: 'Unknown test method' },
    })
})
