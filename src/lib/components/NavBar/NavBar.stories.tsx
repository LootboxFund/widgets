import { $CardViewport } from '../Generics'
import NavBar from './index'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'NavBar',
  component: NavBar,
}

const Template = () => {
  return (
    <LocalizationWrapper>
      <$CardViewport width="100%">
        <NavBar />
      </$CardViewport>
    </LocalizationWrapper>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
