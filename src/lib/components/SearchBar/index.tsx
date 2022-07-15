import { COLORS, ContractAddress } from '@wormgraph/helpers'
import useWindowSize from 'lib/hooks/useScreenSize'
import react, { useState } from 'react'
import styled from 'styled-components'
import $Button from '../Generics/Button'
import $Input from '../Generics/Input'
import { validateErc20 } from '../RewardSponsors'
import { manifest } from 'manifest'
import useWords from 'lib/hooks/useWords'

export interface TemplateProps {}
const SearchBar = (props: TemplateProps) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [searchString, setSearchString] = useState('')
  const validAddress = validateErc20(searchString as ContractAddress)
  return (
    <$SearchBar>
      <$Input
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        screen={screen}
        style={{
          backgroundColor: `${COLORS.surpressedBackground}1A`,
          color: COLORS.surpressedFontColor,
          fontWeight: 'lighter',
          height: '100%',
          flex: 5,
        }}
        placeholder={'Enter Lootbox Address'}
      ></$Input>
      <$Button
        screen={screen}
        disabled={!validAddress}
        color={`${COLORS.white}`}
        onClick={() => window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${searchString}`, '_self')}
        backgroundColor={validAddress ? `${COLORS.trustBackground}` : `${COLORS.trustBackground}2A`}
        style={{
          height: '100%',
          border: `1px solid ${COLORS.warningBackground}40`,
          fontWeight: screen === 'desktop' ? 'bold' : 'normal',
          fontSize: screen === 'desktop' ? '1.5rem' : '1rem',
          marginLeft: '5px',
          width: '100px',
          padding: screen === 'desktop' || screen === 'tablet' ? '' : '0px 10px',
        }}
      >
        {words.search}
      </$Button>
    </$SearchBar>
  )
}

const $SearchBar = styled.div<{}>`
  display: flex;
  flex-direction: row;
  width: 100%;
`

export default SearchBar
