import react from 'react'
import styled from 'styled-components'

export interface RepeatCreateProps {}
const RepeatCreate = (props: RepeatCreateProps) => {
  return (
    <$RepeatCreate>
      <p>RepeatCreate</p>
    </$RepeatCreate>
  )
}

const $RepeatCreate = styled.div<{}>``

export default RepeatCreate
