import React from 'react'
import BadgeMinter from 'lib/components/BadgeMinter'

export default {
  title: 'BadgeMinter',
  component: BadgeMinter,
}

const Demo = () => (
  <div style={{ width: 'auto', maxWidth: '760px', height: '600px' }}>
    <BadgeMinter />
  </div>
)
export const Basic = Demo.bind({})
Basic.args = {}
