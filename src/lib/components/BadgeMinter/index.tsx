import react from 'react'
import styled from 'styled-components'

export interface TemplateProps {}
const BadgeMinter = (props: TemplateProps) => {
  return (
    <$BadgeMinter>
      <p>BadgeMinter</p>
    </$BadgeMinter>
  )
}

const $BadgeMinter = styled.div<{}>``

export default BadgeMinter
