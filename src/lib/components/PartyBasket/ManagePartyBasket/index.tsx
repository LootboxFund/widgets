import AuthGuard from 'lib/components/AuthGuard'
import LogRocket from 'logrocket'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import Spinner from 'lib/components/Generics/Spinner'
import { useMutation, useQuery } from '@apollo/client'
import { BULK_WHITELIST_MUTATION, GET_PARTY_BASKET } from './api.gql'
import {
  BulkWhitelistPayload,
  BulkWhitelistResponse,
  BulkWhitelistResponseSuccess,
  GetLootboxByAddressResponse,
  GetPartyBasketResponse,
  GetPartyBasketResponseSuccess,
  MutationBulkWhitelistArgs,
} from 'lib/api/graphql/generated/types'
import { Oopsies } from 'lib/components/Profile/common'
import styled from 'styled-components'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ManageLootboxHeading } from 'lib/components/ManageLootbox'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { NETWORK_OPTIONS } from 'lib/api/network'
import { $InputWrapper } from 'lib/components/CreateLootbox/StepChooseFunding'
import $Input from 'lib/components/Generics/Input'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { $ErrorText } from 'lib/components/BuyShares/PurchaseComplete'
import { ethers } from 'ethers'
import { $InputMedium } from 'lib/components/Authentication/Shared'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import { manifest } from 'manifest'

interface ManagePartyBasketProps {
  partyBasketAddress: Address
}

interface SingleWhitelistState {
  status: 'pending' | 'success' | 'error'
  error?: string
}

interface BulkWhitelistState {
  status: 'pending' | 'loading' | 'success' | 'error'
  error?: string
  partialErrors?: string[]
}

const CSV_UPLOAD_COLUMN_KEY = 'address'
export const exampleCSV =
  'https://docs.google.com/spreadsheets/d/1eecK4uZB-9EVv2NGYUyOOXdZMUMwSW_Brq8FYttUUgE/edit?usp=sharing'

const ManagePartyBasket = (props: ManagePartyBasketProps) => {
  const [whitelistAddress, setWhitelistAddress] = useState<Address | undefined>()
  const [singleWhitelistState, setSingleWhitelistState] = useState<SingleWhitelistState>()
  const [bulkWhitelistState, setBulkWhitelistState] = useState<BulkWhitelistState>()
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{
    getPartyBasket: GetPartyBasketResponse
  }>(GET_PARTY_BASKET, {
    variables: {
      partyBasketAddress: props.partyBasketAddress,
    },
  })
  const [bulkWhitelistMutation, { loading: bulkWhitelistLoading }] = useMutation<
    {
      bulkWhitelist: BulkWhitelistResponse
    },
    { payload: BulkWhitelistPayload }
  >(BULK_WHITELIST_MUTATION)

  const validateAddress = (address?: Address): Address => {
    if (!address) {
      throw new Error('Please enter an address')
    }

    if (!ethers.utils.isAddress(address)) {
      throw new Error('Please enter a valid address')
    }

    return address
  }

  const singleWhitelistAction = async () => {
    try {
      const validatedAddress = validateAddress(whitelistAddress)

      const res = await bulkWhitelistMutation({
        variables: {
          payload: {
            partyBasketAddress: props.partyBasketAddress,
            whitelistAddresses: [validatedAddress],
          },
        },
      })

      if (res.data?.bulkWhitelist?.__typename === 'ResponseError') {
        throw new Error(res.data.bulkWhitelist.error?.message)
      } else if ((res.data?.bulkWhitelist as BulkWhitelistResponseSuccess)?.errors?.length) {
        const errs = (res.data?.bulkWhitelist as BulkWhitelistResponseSuccess)?.errors as string[]

        throw new Error(errs[0] || 'An error occurred')
      }
      setSingleWhitelistState({ status: 'success', error: undefined })
      setTimeout(() => {
        setSingleWhitelistState({ status: 'pending' })
      }, 2000)
    } catch (err) {
      console.error(err)
      setSingleWhitelistState({ status: 'error', error: err?.message || 'An error occured!' })
    }
  }

  const bulkWhitelistAction = async (addresses: Address[]) => {
    if (addresses.length === 0) {
      setBulkWhitelistState({ status: 'error', error: 'No addresses to process' })
      return
    }

    const preprocessingErrors = addresses
      .map((address, index) => {
        try {
          validateAddress(address)
          return undefined
        } catch (err) {
          // Index + 2 because we start at index 0 & take header into account
          return `(Row ${index + 2}) Error: ${err?.message || 'An error occured!'}`
        }
      })
      .filter((err: string | undefined) => !!err)

    if (preprocessingErrors.length > 0) {
      setBulkWhitelistState({ status: 'error', error: `CSV Validation Errors\n${preprocessingErrors.join('\n')}` })
      return
    }

    try {
      const validatedAddresses = addresses.map(validateAddress)

      const res = await bulkWhitelistMutation({
        variables: {
          payload: {
            partyBasketAddress: props.partyBasketAddress,
            whitelistAddresses: validatedAddresses,
          },
        },
      })

      if (res.data?.bulkWhitelist?.__typename === 'ResponseError') {
        throw new Error(res.data.bulkWhitelist.error?.message)
      } else if ((res.data?.bulkWhitelist as BulkWhitelistResponseSuccess)?.errors?.length) {
        const partialErrors: (string | null)[] = (res.data?.bulkWhitelist as BulkWhitelistResponseSuccess)?.errors as (
          | string
          | null
        )[]

        const partialErrorsFmt: string[] = partialErrors
          .map((err, index) => (err ? `(Row ${index}) Error: ${err}` : undefined))
          .filter((e) => e != undefined) as string[]

        // These are partial errors from the backend, indicating that we had a problem with these certain addresses
        setBulkWhitelistState({
          status: 'error',
          error: undefined,
          partialErrors: partialErrorsFmt,
        })
        return
      }

      setBulkWhitelistState({ status: 'success', error: undefined, partialErrors: undefined })
      setTimeout(() => {
        setBulkWhitelistState({ status: 'pending' })
      }, 5000)
    } catch (err) {
      console.error(err)
      setBulkWhitelistState({ status: 'error', error: err?.message || 'An error occured!' })
    }
  }

  const clearFile = () => {
    const input = document.getElementById('csv-upload') as any

    if (input) {
      input.value = null
    }
  }

  const processCsv = async (e: SyntheticEvent) => {
    if (bulkWhitelistState?.status === 'loading') {
      console.error('Upload already in process')
      return
    }
    setBulkWhitelistState({ status: 'loading' })
    // @ts-ignore
    const selectedFiles = document.getElementById('csv-upload')?.files
    if (selectedFiles?.length) {
      const file = selectedFiles[0]

      const reader = new FileReader()
      reader.onload = async (e: ProgressEvent) => {
        // @ts-ignore
        const csv = e.target?.result as string | undefined
        console.log(`
        
          CSV FILE UPLOAD 

          ${csv}
        
        `)

        const [header, ...rows] = csv?.split(/[\r]?\n/) || []

        // We assume a column named "address" in header
        // Get the column index of "address" & use that to process
        const addressIndex = header?.split(',').findIndex((col) => col.trim().toLowerCase() === CSV_UPLOAD_COLUMN_KEY)

        if (addressIndex == undefined || addressIndex === -1) {
          setBulkWhitelistState({
            status: 'error',
            error: `No "${CSV_UPLOAD_COLUMN_KEY}" column found in uploaded CSV. Please fix your csv file by adding a column named "${CSV_UPLOAD_COLUMN_KEY}" with the desired addresses you want to whitelist & re-upload.`,
          })
          return
        } else if (rows.length === 0) {
          setBulkWhitelistState({
            status: 'error',
            error: 'No addresses found in uploaded CSV.',
          })
          return
        }

        const addresses = rows.map((row) => {
          return row.trim().split(',')[addressIndex].trim() as Address
        })

        await bulkWhitelistAction(addresses)
      }
      reader.readAsText(file)
    } else {
      setBulkWhitelistState({ status: 'error', error: 'No file selected' })
    }
  }

  const copyRedeemUrl = () => {
    navigator.clipboard.writeText(
      `${manifest.microfrontends.webflow.basketRedeemPage}?basket=${props.partyBasketAddress}`
    )
    const el = document.getElementById('share-redeem-link')
    if (el) {
      el.innerText = '✅ Copied to clipboard!'
      setTimeout(() => {
        el.innerText = 'Share Link to Redeem'
      }, 2000)
    }
  }

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error) {
    return <Oopsies title="Error loading Party Basket" message={error?.message || ''} icon="🤕" />
  } else if (data?.getPartyBasket?.__typename === 'ResponseError') {
    return <Oopsies title="Error loading Party Basket" message={data?.getPartyBasket?.error?.message || ''} icon="🤕" />
  }

  const {
    name: partyBasketName,
    chainIdHex,
    lootboxSnapshot,
  } = (data?.getPartyBasket as GetPartyBasketResponseSuccess)?.partyBasket

  const chain = NETWORK_OPTIONS.find((c) => c.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  const { name: lootboxName, address: lootboxAddress } = lootboxSnapshot || {}

  const network = NETWORK_OPTIONS.find((network) => network.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  return (
    <$ManagePartyBasket>
      <$StepCard screen={screen} themeColor={network.themeColor}>
        <$Vertical spacing={4}>
          <$Vertical spacing={2}>
            {lootboxName && (
              <$Horizontal verticalCenter>
                <$ManageLootboxHeading screen={screen}>{lootboxName}</$ManageLootboxHeading>
                <HelpIcon tipID="partyBasket" />
                <ReactTooltip id="partyBasket" place="right" effect="solid">
                  This is your Party Basket for "{lootboxName}". You can bulk mint NFTs to this contract address, and
                  then bulk whitelist people (with a CSV upload) to pick them up for FREE (AKA: Redeem a bounty)!
                </ReactTooltip>
              </$Horizontal>
            )}
            {partyBasketName && (
              <$Horizontal verticalCenter>
                <$ManageLootboxHeading screen={screen}>{partyBasketName || 'Party Basket'}</$ManageLootboxHeading>
              </$Horizontal>
            )}
          </$Vertical>

          <$StepSubheading>
            This is your Party Basket for "{lootboxName}". Party Baskets hold onto Lootbox NFTs and allow you to
            "whitelist" specific wallets, giving them special permission to redeem an NFT from the Party Basket for
            free.
            <br />
            <br />
            Bulk whitelisting will grant a large number of wallets a free NFT to redeem. You can use a CSV file (like{' '}
            <a href={exampleCSV} target="_blank" style={{ display: 'contents' }}>
              this one
            </a>
            ), and then you can upload it by clicking the button below. Your Party Basket will need to have Lootbox NFTs
            in it (by bulk minting) in order for your followers to be able to redeem one.
          </$StepSubheading>
          <$Vertical spacing={3}>
            <$Vertical>
              <span>
                <$StepSubheading>
                  Whitelist Address <HelpIcon tipID="whitelistAddress" />
                  <ReactTooltip id="whitelistAddress" place="right" effect="solid">
                    Whitelisting is a feature that allows give away an NFT for free. The address you specify will be
                    able to redeem this ONE TIME, and your Lootbox Bounty NFT will be transfered to them when they
                    redeem it.
                  </ReactTooltip>
                </$StepSubheading>
              </span>
              <$Horizontal spacing={2} flexWrap={screen === 'mobile'}>
                <$InputWrapper
                  screen={screen}
                  marginRight="0px"
                  style={{
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <$Input
                      type="text"
                      value={whitelistAddress}
                      onChange={(e) => setWhitelistAddress(e?.target?.value as Address | undefined)}
                      min="0"
                      placeholder="e.g. 0x12345..."
                      screen={screen}
                      style={{ fontWeight: 'lighter' }}
                    />
                  </div>
                </$InputWrapper>
                <$AddWhitelistButton
                  themeColor={network.themeColor}
                  onClick={singleWhitelistAction}
                  disabled={bulkWhitelistLoading}
                  screen={screen}
                >
                  <$ManageLootboxHeading
                    screen={screen}
                    style={{
                      color: '#ffffff',
                      margin: 'auto 0px',
                      fontSize: '1.5rem',
                    }}
                  >
                    {bulkWhitelistLoading ? 'LOADING' : 'ADD'}
                  </$ManageLootboxHeading>
                </$AddWhitelistButton>
              </$Horizontal>
            </$Vertical>

            {singleWhitelistState?.status === 'error' && singleWhitelistState?.error && (
              <$ErrorText>{singleWhitelistState.error}</$ErrorText>
            )}
            {singleWhitelistState?.status === 'success' && (
              <$StepSubheading style={{ textAlign: 'center', display: 'inline' }}>
                ✅ Successfully whitelisted!
              </$StepSubheading>
            )}

            <br />
            <$Vertical>
              <$Horizontal>
                <$StepSubheading
                  style={{
                    width: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Bulk Whitelist Address <HelpIcon tipID="bulkWhitelist" />
                  <ReactTooltip id="bulkWhitelist" place="right" effect="solid">
                    Upload a ".csv" file of addresses to whitelist.{' '}
                    <span style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                      The CSV file needs a column titled "{CSV_UPLOAD_COLUMN_KEY}".
                    </span>{' '}
                    These addresses will get whitelisted which will allow each address to pick up their own NFT (without
                    requiring you to send it to them). Whitelisting an addThis will allow yWhitelisting is a feature
                    that allows give away an NFT for free. The address you specify will be able to redeem this ONE TIME,
                    and your Lootbox Bounty NFT will be transfered to them when they redeem it.
                  </ReactTooltip>
                </$StepSubheading>
                <$StepSubheadingExtra
                  style={{ fontStyle: 'italic', textDecoration: 'underline' }}
                  href={exampleCSV}
                  target="_blank"
                >
                  View Sample CSV
                </$StepSubheadingExtra>
              </$Horizontal>

              <$CSVLabel htmlFor="csv-upload" themeColor={chain.themeColor} screen={screen}>
                Upload CSV
              </$CSVLabel>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onClick={clearFile}
                onChange={processCsv}
                style={{ display: 'none' }}
              />
            </$Vertical>

            {bulkWhitelistState?.status === 'loading' && (
              <$StepSubheading style={{ display: 'inline' }}>
                <Spinner color={`${COLORS.surpressedFontColor}ae`} size="30px" /> Processing...
              </$StepSubheading>
            )}

            {bulkWhitelistState?.status === 'success' && (
              <$StepSubheading style={{ display: 'inline' }}>✅ Successfully whitelisted!</$StepSubheading>
            )}
            {(bulkWhitelistState?.status === 'error' || bulkWhitelistState?.error) && (
              <$StepSubheading style={{ display: 'inline', whiteSpace: 'pre-line' }}>
                ❌ {bulkWhitelistState?.error || 'An error occured!'}
              </$StepSubheading>
            )}
            {bulkWhitelistState?.partialErrors && (
              <$StepSubheading style={{ display: 'inline', whiteSpace: 'pre-line' }}>
                ⚠️{' '}
                {`Partial Errors with Submission. Please re-whitelist the rows specified below.\n\n${bulkWhitelistState?.partialErrors?.join(
                  '\n'
                )}`}
              </$StepSubheading>
            )}

            <br />

            <$BasketButton id="share-redeem-link" themeColor={chain.themeColor} screen={screen} onClick={copyRedeemUrl}>
              🔗 Share Link to Redeem
            </$BasketButton>
            <$BasketLink
              themeColor={chain.themeColor}
              screen={screen}
              href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootboxAddress}`}
            >
              View Original Lootbox
            </$BasketLink>

            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  View All Whitelisted Wallets <HelpIcon tipID="allWhite" />
                  <ReactTooltip id="allWhite" place="right" effect="solid">
                    Download a .csv file that contains a list of all the whitelisted addresses for this Party Box.
                  </ReactTooltip>
                </$StepSubheading>
              </span>
              <$BasketButton themeColor={chain.themeColor} screen={screen}>
                Download CSV
              </$BasketButton>
            </$Vertical>
            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  Party Basket Address <HelpIcon tipID="pbAddr" />
                  <ReactTooltip id="pbAddr" place="right" effect="solid">
                    The smart contract address for your Party Basket.
                  </ReactTooltip>
                </$StepSubheading>
              </span>

              <$Horizontal spacing={2}>
                <$InputWrapper
                  screen={screen}
                  marginRight="0px"
                  style={{
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <$Input
                      disabled
                      type="text"
                      value={props.partyBasketAddress}
                      placeholder="e.g. 0x12345..."
                      screen={screen}
                      style={{ fontWeight: 'lighter' }}
                    />
                  </div>
                </$InputWrapper>
                <div>
                  <CopyIcon text={props.partyBasketAddress} />
                </div>
              </$Horizontal>
            </$Vertical>
          </$Vertical>
        </$Vertical>
      </$StepCard>
    </$ManagePartyBasket>
  )
}

const ManagePartyBasketPage = () => {
  const [partyBasketAddress, setPartyBasketAddress] = useState<Address | undefined>()

  useEffect(() => {
    const partyBasketAddress = parseUrlParams('basket') as Address
    setPartyBasketAddress(partyBasketAddress)
    onLoad(partyBasketAddress)
  }, [])

  return (
    <AuthGuard>
      {!!partyBasketAddress ? (
        <ManagePartyBasket partyBasketAddress={partyBasketAddress} />
      ) : (
        <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
      )}
    </AuthGuard>
  )
}

export const onLoad = async (partyBasketAddress: Address) => {
  initLogging()
  //   try {
  //     //   await initDApp(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
  //     await initDApp()
  //   } catch (err) {
  //     LogRocket.captureException(err)
  //   }
}

export const $PartyBasketHeading = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '2.2rem' : '1.5rem')};
  line-height: ${(props) => (props.screen === 'desktop' ? '2.4rem' : '1.7rem')};
  font-weight: bold;
  color: ${COLORS.black};
`

const $StepSubheadingExtra = styled.a`
  font-style: italic;
  text-decoration: underline;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  width: 90%;
  margin-bottom: 3px;
  vertical-align: middle;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  word-break: break-word;
`

const $StepCard = styled.div<{
  themeColor: string
  boxShadow?: string
  screen: ScreenSize
}>`
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => `0px 3px 20px ${props.themeColor}`};
  border: ${(props) => `3px solid ${props.themeColor}`};
  border-radius: 20px;
  padding: ${(props) => (props.screen === 'desktop' ? '40px' : '20px')};
  max-width: 800px;
  font-family: sans-serif;
`

const $CSVLabel = styled.label<{ themeColor: string; screen: ScreenSize }>`
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  line-height: 62px;
  max-width: 420px;

  background: #ffffff;
  border: 1px solid ${(props) => props.themeColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0px 20px;
  cursor: pointer;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
  font-size: ${(props) => (props.screen === 'mobile' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.xlarge)};
  color: ${(props) => props.themeColor};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-align: center;
  display: inline;
`

const $BasketLink = styled.a<{
  themeColor: string
  screen: ScreenSize
}>`
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  line-height: 62px;
  max-width: 420px;

  background: #ffffff;
  border: 1px solid ${(props) => props.themeColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0px 20px;
  cursor: pointer;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
  font-size: ${(props) => (props.screen === 'mobile' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.xlarge)};
  color: ${(props) => props.themeColor};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-align: center;
  display: inline;

  text-decoration: none;
`

const $BasketButton = styled.div<{
  themeColor: string
  screen: ScreenSize
}>`
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  line-height: 62px;
  max-width: 420px;

  background: #ffffff;
  border: 1px solid ${(props) => props.themeColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0px 20px;
  cursor: pointer;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
  font-size: ${(props) => (props.screen === 'mobile' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.xlarge)};
  color: ${(props) => props.themeColor};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-align: center;
  display: inline;
`

const $ManagePartyBasket = styled.div``

const $AddWhitelistButton = styled.button<{
  themeColor: string
  screen?: ScreenSize
}>`
  background: ${(props) => props.themeColor};
  padding: 0px 20px;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid ${(props) => props.themeColor};
  height: 62px;
  cursor: pointer;
  border-radius: 10px;
  margin: ${(props) => (props.screen === 'mobile' ? '10px 0px auto' : 'auto 0px')};
  width: ${(props) => (props.screen === 'mobile' ? '100%' : 'auto')};
`

const $CopyableInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
`

export default ManagePartyBasketPage
