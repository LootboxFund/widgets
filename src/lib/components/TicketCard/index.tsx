import react, { useEffect, useState } from 'react'
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
import { Address, COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import $Button from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { manifest } from '../../../manifest'
import { checkMobileBrowser } from 'lib/api/createLootbox'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import $Spinner from '../Generics/Spinner'
import { transferNFTOwnership } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'

export interface TicketCardWidgetProps {
  ticketID: string | undefined
  isRedeemEnabled?: boolean
  onScrollToMint?: () => void
  forceLoading?: boolean
  isDownloadLootbox?: boolean
  staticHeight?: string
}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const { screen } = useWindowSize()
  const [showTransferUI, setShowTransferUI] = useState(false)
  const [receiverAddress, setReceiverAddress] = useState<Address>()
  const [transferStatus, setTransferStatus] = useState<"none" | "pending" | "success" | "failure">("none")
  const snapUserState = useSnapshot(userState)
  const currentUserAddress = snapUserState.currentAccount
  const snap = useSnapshot(ticketCardState)
  const stateID =
    snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress as ContractAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID]

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
    if (!metadata || !metadata?.lootboxCustomSchema) {
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

      const key = props.isDownloadLootbox ? 'lootbox' : props.ticketID

      const stampFilePath = `${manifest.storage.buckets.stamp.id}/${metadata.lootboxCustomSchema.chain.address}/${key}.png`
      const encodeURISafe = (stringFragment: string) =>
        encodeURIComponent(stringFragment).replace(/'/g, '%27').replace(/"/g, '%22')
      const stampUrl = `${manifest.storage.downloadUrl}/${encodeURISafe(stampFilePath)}?alt=media`

      if (isMetamaskMobileBrowser) {
        // Seems like mobile metamask browser, which crashes when trying to download a file
        // So instead, here we just open the url in a new tab
        window.open(stampUrl, '_blank')
      } else {
        await downloadFile(`${snap.lootboxAddress}-${key}`, stampUrl)
      }
    } catch (err) {
      console.error('Error downloading stamp', err)
    }
  }

  const renderNFTTransferUI = () => {
    const canSend = props.ticketID && currentUserAddress && receiverAddress && snap.lootboxAddress
    const transferNFT = async (ticketID: string | undefined) => {
      const lootboxAddress = snap.lootboxAddress
      if (ticketID && currentUserAddress && receiverAddress && lootboxAddress) {
        setTransferStatus('pending')
        try {
          await transferNFTOwnership(ticketID, lootboxAddress, currentUserAddress, receiverAddress)
          setTransferStatus('success')
        } catch (e) {
          console.log(e)
          setTransferStatus('failure')
          setTimeout(() => {
            setTransferStatus('none')
          }, 5000)
        }
      }
    }
    if (showTransferUI) {
      const renderLoadingButton = () => {
        if (transferStatus === "pending") {
          return <$Spinner color={COLORS.surpressedFontColor}></$Spinner>
        } else if (transferStatus === "success") {
          return <span>✅</span>
        } else if (transferStatus === "failure") {
          return <span>⛔️</span>
        } else {
          return <button onClick={() => transferNFT(props.ticketID)} style={{ cursor: canSend ? 'pointer' : 'not-allowed',  border: '0px solid white' }}>Send</button>
        }
      }
      return (
        <section style={{ backgroundColor: `${COLORS.surpressedBackground}2A`, padding: '5px', borderRadius: '5px' }}>
          <$Horizontal style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontFamily: 'sans-serif', color: COLORS.surpressedFontColor }}>
            <span>{`Transfer #${props.ticketID}`}</span>
            <span onClick={() => {
              setShowTransferUI(false)
              setTransferStatus('none')
            }} style={{ cursor: 'pointer', fontSize: '0.8rem' }}>cancel</span>
          </$Horizontal>
          <$Horizontal>
            <input placeholder="Address of Receiver" onChange={(e) => setReceiverAddress(e.target.value as Address)} value={receiverAddress} style={{ padding: '5px', marginTop: '15px', flex: 1, border: '0px solid white' }}></input>
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50px' }}>
             {renderLoadingButton()}
            </div>
          </$Horizontal>
        </section>
      )
    }
    return (
      <$Button
          onClick={() => setShowTransferUI(true)}
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
          Transfer Ownership
      </$Button>
    )
  }

  return (
    <$RootContainer>
      {ticket && ticket.route === '/payout' ? (
        <ViewPayout ticketID={props.ticketID} staticHeight={props.staticHeight} />
      ) : (
        <TicketCard ticketID={props.ticketID} onScrollToMint={props.onScrollToMint} forceLoading={props.forceLoading} staticHeight={props.staticHeight} />
      )}
      {props.isRedeemEnabled && <RedeemButton ticketID={props.ticketID} isRedeemable={isRedeemable as boolean} />}
      {!!ticket ? (
        <>
          {renderNFTTransferUI()}
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
              marginTop: '-5px',
              padding: '0px'
            }}
          >
            Download Image
          </$Button>
        </>
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
            minHeight: '40px',
          }}
        ></$Button>
      )}
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
