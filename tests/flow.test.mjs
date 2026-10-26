import assert from 'node:assert/strict'
import test from 'node:test'
import { reconcileGroups } from '../src/flow.ts'

test('editing text preserves its category while new thoughts need sorting', () => {
  const original = { id: 'a', text: 'งานค้าง' }
  const edited = { ...original, text: 'อยากจัดเวลาทำงานใหม่' }
  const added = { id: 'b', text: 'เรื่องใหม่' }
  assert.deepEqual(reconcileGroups([edited, added], { pool: [], actionable: [original], nonActionable: [] }), {
    pool: [added], actionable: [edited], nonActionable: [],
  })
})

test('identical text stays in separate categories and deletion removes only its own item', () => {
  const first = { id: 'a', text: 'เรื่องเดียวกัน' }
  const second = { id: 'b', text: 'เรื่องเดียวกัน' }
  const groups = { pool: [], actionable: [first], nonActionable: [second] }
  assert.deepEqual(reconcileGroups([first, second], groups), groups)
  assert.deepEqual(reconcileGroups([second], groups), { pool: [], actionable: [], nonActionable: [second] })
})
