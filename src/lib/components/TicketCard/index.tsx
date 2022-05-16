import react, { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import TicketCard from 'lib/components/TicketCard/TicketCard'
import ViewPayout from 'lib/components/TicketCard/ViewPayout'
import { useSnapshot } from 'valtio'
import { ticketCardState, loadTicketData } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import RedeemButton from 'lib/components/TicketCard/RedeemButton'
import styled from 'styled-components'
import { generateStateID } from './state'
import { downloadFile } from 'lib/api/stamp'
import { COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import $Button from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { manifest } from '../../../manifest'
import { checkMobileBrowser } from 'lib/api/createLootbox'

export interface TicketCardWidgetProps {
  ticketID: string | undefined
  isRedeemEnabled?: boolean
  onScrollToMint?: () => void
  forceLoading?: boolean
  showDownloadOption?: boolean
}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(ticketCardState)
  const stateID =
    snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress as ContractAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID]

  useEffect(() => {
    window.onload = async () => {
      const lootboxAddress = parseUrlParams('lootbox') as ContractAddress
      ticketCardState.lootboxAddress = lootboxAddress
      try {
        await initDApp()
      } catch (err) {
        console.error('Error loading DApp in TicketCard', err)
      }
      if (props.ticketID) {
        loadTicketData(props.ticketID).catch((err) => console.error('Error loading ticket data', err))
      }
    }
  }, [])

  useEffect(() => {
    if (props.ticketID) {
      loadTicketData(props.ticketID).catch((err) => console.error(err))
    }
  }, [props.ticketID])

  const dividends = ticket && ticket.dividends
  const metadata = ticket && ticket.data.metadata
  const activeDividends = dividends && dividends.filter((dividend) => !dividend.isRedeemed)
  const isRedeemable = activeDividends && activeDividends.length > 0

  const downloadStamp = async () => {
    if (!metadata) {
      console.error('Could not download stamp, no ticket metadata')
      return
    }
    try {
      const isMetamaskMobileBrowser = checkMobileBrowser() && !!window.ethereum

      // Determine the filepath to the stamp
      // Normally we would use the ticket metadata as such:
      //    const stampUrl = metadata.image
      // However, there was a bug previously where it was not recoreded properly
      // So for now, we just generate the path on the fly...
      const stampFilePath = `${manifest.storage.buckets.stamp.id}/${metadata.lootboxCustomSchema.chain.address}.png`
      const encodeURISafe = (stringFragment: string) =>
        encodeURIComponent(stringFragment).replace(/'/g, '%27').replace(/"/g, '%22')
      const stampUrl = `${manifest.storage.downloadUrl}/${encodeURISafe(stampFilePath)}?alt=media`

      console.log('opening stamp url', stampUrl)

      if (isMetamaskMobileBrowser) {
        // Seems like mobile metamask browser, which crashes when trying to download a file
        // So instead, here we just open the url in a new tab
        window.open(stampUrl, '_blank')
      } else {
        await downloadFile(`${snap.lootboxAddress}-ticket_${props.ticketID}`, stampUrl)
      }
    } catch (err) {
      console.error('Error downloading stamp', err)
    }
  }

  return (
    <$RootContainer>
      {ticket && ticket.route === '/payout' ? (
        <ViewPayout ticketID={props.ticketID} />
      ) : (
        <TicketCard ticketID={props.ticketID} onScrollToMint={props.onScrollToMint} forceLoading={props.forceLoading} />
      )}
      {props.isRedeemEnabled && <RedeemButton ticketID={props.ticketID} isRedeemable={isRedeemable as boolean} />}
      {props.showDownloadOption &&
        (!!ticket ? (
          <$Button
            onClick={downloadStamp}
            screen={screen}
            backgroundColor={COLORS.white}
            color={`${COLORS.surpressedFontColor}80`}
            style={{
              border: 'none',
              boxShadow: 'none',
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.medium,
            }}
          >
            Download Image
          </$Button>
        ) : (
          <$Button
            screen={screen}
            backgroundColor={COLORS.white}
            color={`${COLORS.surpressedFontColor}80`}
            style={{
              border: 'none',
              boxShadow: 'none',
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.large,
              cursor: 'default',
            }}
          ></$Button>
        ))}
    </$RootContainer>
  )
}

export const $RootContainer = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const $DownloadButton = styled.button``

export default TicketCardWidget
