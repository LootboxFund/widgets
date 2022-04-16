import React, { useEffect, useState } from 'react'
import ManagementPage, { ManagementPageProps } from 'lib/components/ManagementPage'

export default {
  title: 'Management Page',
  component: ManagementPage,
}

const Template = (args: ManagementPageProps) => {
  return <ManagementPage {...args} />
}

export const Basic = Template.bind({})
Basic.args = {}
