import BadgeFactory, { BadgeFactoryProps } from 'lib/components/BadgeFactory'

export default {
  title: 'BadgeFactory',
  component: BadgeFactory,
}

const Demo = (args: BadgeFactoryProps) => {
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <BadgeFactory />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
