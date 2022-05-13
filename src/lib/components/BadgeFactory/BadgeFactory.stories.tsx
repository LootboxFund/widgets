import BadgeFactory from 'lib/components/BadgeFactory'

export default {
  title: 'BadgeFactory',
  component: BadgeFactory,
}

const Demo = () => {
  return (
    <div style={{ width: 'auto', maxWidth: '760px', height: '600px' }}>
      <BadgeFactory />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
