import { ReactNode, useState } from 'react'
import { COLORS, LootboxID, TYPOGRAPHY } from '@wormgraph/helpers'
import './StickyBottomFrame.css'
import { detectMobileAddressBarSettings } from 'lib/api/helpers'
import styled from 'styled-components'

interface Props {
  children: ReactNode
  backgroundCover: object
  actionBar: ReactNode
}
const StickyBottomFrame = ({ actionBar, children, backgroundCover }: Props) => {
  const { userAgent, addressBarlocation, addressBarHeight } = detectMobileAddressBarSettings()
  return (
    <div className="invite-loop-wrapper">
      <div
        className="viral-invite-loop-intro-slid"
        style={{
          ...backgroundCover,
          // @ts-ignore
          maxHeight: screen.availHeight - addressBarHeight,
          height: screen.availHeight - addressBarHeight,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="powered-by-banner" id="fan-rewards-banner">
          <div className="powered-by-banner-text">
            <span>Fan Rewards Powered by</span>
            <b>{` 🎁 `}</b>
            <span className="lootbox-span">LOOTBOX</span>
          </div>
        </div>
        <div
          className="main-layout-div"
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {children}
        </div>
        <div
          className="action-button-div"
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {actionBar}
        </div>
      </div>
    </div>
  )
}

export default StickyBottomFrame
