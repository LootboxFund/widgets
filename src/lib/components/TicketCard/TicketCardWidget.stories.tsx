import React from 'react'
import TicketCardWidget, { TicketCardWidgetProps } from 'lib/components/TicketCard'

export default {
  title: 'TicketCardWidget',
  component: TicketCardWidget,
}

const Template = (args: TicketCardWidgetProps) => <TicketCardWidget {...args} />

export const Basic = Template.bind({})
Basic.args = {}
