import { ReactNode, useState } from 'react'
import { COLORS, LootboxID, TYPOGRAPHY } from '@wormgraph/helpers'
import './StickyBottomFrame.css'
import { detectMobileAddressBarSettings } from 'lib/api/helpers'
import styled from 'styled-components'

interface Props {
  submitText?: string
  loading: boolean
  submitForm: () => void
  children: ReactNode
  backgroundCover: object
}
const StickyBottomFrame = ({ loading, submitForm, children, backgroundCover, submitText = 'Finish' }: Props) => {
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
          <button disabled={loading} onClick={submitForm} className="email-submit-button">
            {loading ? (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/lootbox-fund-staging.appspot.com/o/shared-company-assets%2Floading-gif.gif?alt=media"
                height="30px"
                width="auto"
              />
            ) : (
              <b className="email-submit-button-text">{submitText}</b>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StickyBottomFrame
