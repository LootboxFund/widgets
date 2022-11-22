import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'
import { useState } from 'react'
import styled from 'styled-components'

export const HOME_IMG_URL = `${manifest.storage.downloadUrl}/${manifest.storage.buckets.constants.id}%2Fassets%2Flootbox-home-img.png?alt=media`

const NavBar = () => {
  const { screen } = useWindowSize()
  const { user } = useAuth()
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)
  return (
    <$NavBarContainer>
      <$NavUL>
        <$NavLI float="left" type="horizontal">
          <$NavA href={manifest.microfrontends.webflow.landingPage} screen={screen} type="horizontal">
            <img alt="Home" src={HOME_IMG_URL}></img>
          </$NavA>
        </$NavLI>

        {screen === 'mobile' && (
          <$BurgerContainer
            screen={screen}
            onClick={() => {
              setIsMobileExpanded(!isMobileExpanded)
            }}
          >
            <$BurgerBar />
            <$BurgerBar style={{ marginTop: '5px', marginBottom: '5px' }} />
            <$BurgerBar />
          </$BurgerContainer>
        )}

        {((screen === 'mobile' && isMobileExpanded) || screen !== 'mobile') && [
          <$NavLI key="nav-auth" float="right" type={screen === 'mobile' ? 'vertical' : 'horizontal'}>
            {user ? (
              <$NavA
                href={manifest.microfrontends.webflow.logout}
                screen={screen}
                type={screen === 'mobile' ? 'vertical' : 'horizontal'}
              >
                Logout
              </$NavA>
            ) : (
              <$NavA
                href={manifest.microfrontends.webflow.myProfilePage}
                screen={screen}
                type={screen === 'mobile' ? 'vertical' : 'horizontal'}
              >
                Login
              </$NavA>
            )}
          </$NavLI>,
          <$NavLI key="nav-my-tickets" float="right" type={screen === 'mobile' ? 'vertical' : 'horizontal'}>
            <$NavA
              href={manifest.microfrontends.webflow.myTickets}
              screen={screen}
              type={screen === 'mobile' ? 'vertical' : 'horizontal'}
            >
              My Tickets
            </$NavA>
          </$NavLI>,
          <$NavLI key="nav-profile" float="right" type={screen === 'mobile' ? 'vertical' : 'horizontal'}>
            <$NavA
              href={manifest.microfrontends.webflow.myProfilePage}
              screen={screen}
              type={screen === 'mobile' ? 'vertical' : 'horizontal'}
            >
              Profile
            </$NavA>
          </$NavLI>,
        ]}
      </$NavUL>
    </$NavBarContainer>
  )
}

const $NavBarContainer = styled.div`
  width: 100%;
`

const $NavUL = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #ffffff;
`

const $NavLI = styled.li<{ float: 'left' | 'right'; type: 'horizontal' | 'vertical' }>`
  float: ${(props) => (props.type === 'vertical' ? 'none' : props.float)};
  cursor: pointer;

  a:hover:not(.active) {
    background-color: #383838;
    color: ${COLORS.white};
  }
`

const $NavA = styled.a<{ screen: ScreenSize; type: 'horizontal' | 'vertical' }>`
  display: block;
  text-align: ${(props) => (props.type === 'horizontal' ? 'center' : 'left')};
  padding: 14px 16px;
  text-decoration: none;
  font-size: ${(props) => (props.screen === 'mobile' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.xlarge)};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};

  hover:not(.active) {
    color: ${COLORS.white};
  }

  color: #383838;
`

const $BurgerContainer = styled.div<{ screen: ScreenSize }>`
  background-color: transparent;
  box-shadow: none;
  float: right;

  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: ${(props) => (props.screen === 'mobile' ? '55px' : '80px')};
  height: ${(props) => (props.screen === 'mobile' ? '55px' : '80px')};
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
`

const $BurgerBar = styled.div`
  width: 30px;
  height: 4px;
  background-color: #b0b0b0;
  color: hsla(0, 0%, 100%, 0.8);
`

export default NavBar
