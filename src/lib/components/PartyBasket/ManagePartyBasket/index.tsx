import AuthGuard from 'lib/components/AuthGuard'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { SyntheticEvent, useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import Spinner, { LoadingText } from 'lib/components/Generics/Spinner'
import { useMutation, useQuery } from '@apollo/client'
import {
  BULK_WHITELIST_MUTATION,
  EDIT_PARTY_BASKET,
  GET_PARTY_BASKET,
  WHITELIST_UNASSIGNED_CLAIMS,
  PartyBasketFE,
  EditPartyBasketResponseFE,
  WhitelistUnassignedClaimsFE,
} from './api.gql'
import {
  BulkWhitelistPayload,
  BulkWhitelistResponse,
  BulkWhitelistResponseSuccess,
  EditPartyBasketPayload,
  PartyBasketStatus,
  ResponseError,
  WhitelistAllUnassignedClaimsPayload,
  WhitelistAllUnassignedClaimsResponse,
} from 'lib/api/graphql/generated/types'
import { Oopsies } from 'lib/components/Profile/common'
import styled from 'styled-components'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $ErrorMessage, $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ManageLootboxHeading } from 'lib/components/ManageLootbox'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { NETWORK_OPTIONS } from 'lib/api/network'
import { $InputWrapper } from 'lib/components/CreateLootbox/StepChooseFunding'
import $Input from 'lib/components/Generics/Input'
import { $ErrorText } from 'lib/components/BuyShares/PurchaseComplete'
import { ethers } from 'ethers'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import { manifest } from 'manifest'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import { useAuth } from 'lib/hooks/useAuth'
import { PartyBasketID } from 'lib/types'

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

interface AutoWhitelistState {
  status: 'pending' | 'error' | 'success'
  partialErrors?: string[]
}

const CSV_UPLOAD_COLUMN_KEY = 'address'
export const exampleCSV =
  'https://docs.google.com/spreadsheets/d/1eecK4uZB-9EVv2NGYUyOOXdZMUMwSW_Brq8FYttUUgE/edit?usp=sharing'

const ManagePartyBasket = (props: ManagePartyBasketProps) => {
  const intl = useIntl()
  const words = useWords()
  const [whitelistAddress, setWhitelistAddress] = useState<Address | undefined>()
  const [singleWhitelistState, setSingleWhitelistState] = useState<SingleWhitelistState>()
  const [localName, setLocalName] = useState<string>()
  const [localNFTBounty, setLocalNFTBounty] = useState<string>()
  const [localJoinCommunityUrl, setLocalJoinCommunityUrl] = useState<string>()
  const [localStatus, setLocalStatus] = useState<PartyBasketStatus>(PartyBasketStatus.Active)
  const [advancedError, setAdvancedError] = useState<string>()
  const [localMaxClaimsAllowed, setLocalMaxClaimsAllowed] = useState<number>()
  const [bulkWhitelistState, setBulkWhitelistState] = useState<BulkWhitelistState>()
  const [autoWhitelistState, setAutoWhitelistState] = useState<AutoWhitelistState>()
  const { user } = useAuth()
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{
    getPartyBasket: PartyBasketFE | ResponseError
  }>(GET_PARTY_BASKET, {
    variables: {
      partyBasketAddress: props.partyBasketAddress,
    },
  })
  const [whitelistUnassignedClaims, { loading: whitelistUnassignedClaimsLoading }] = useMutation<
    { whitelistAllUnassignedClaims: WhitelistUnassignedClaimsFE | ResponseError },
    { payload: WhitelistAllUnassignedClaimsPayload }
  >(WHITELIST_UNASSIGNED_CLAIMS)
  const [bulkWhitelistMutation, { loading: bulkWhitelistLoading }] = useMutation<
    {
      bulkWhitelist: BulkWhitelistResponse
    },
    { payload: BulkWhitelistPayload }
  >(BULK_WHITELIST_MUTATION)
  const [editPartyBasket, { loading: editPartyBasketLoading }] = useMutation<
    { editPartyBasket: ResponseError | EditPartyBasketResponseFE },
    { payload: EditPartyBasketPayload }
  >(EDIT_PARTY_BASKET, {
    refetchQueries: [GET_PARTY_BASKET],
  })

  useEffect(() => {
    if (!!data && !!(data?.getPartyBasket as PartyBasketFE | undefined)?.partyBasket) {
      const { partyBasket: _partyBasket } = data.getPartyBasket as PartyBasketFE
      setLocalName(_partyBasket.name)
      setLocalJoinCommunityUrl(_partyBasket.joinCommunityUrl)
      setLocalNFTBounty(_partyBasket.nftBountyValue)
      setLocalStatus(_partyBasket.status)
      setLocalMaxClaimsAllowed(_partyBasket.maxClaimsAllowed)
    }
  }, [data])

  const pleaseEnterValidAddressText = intl.formatMessage({
    id: 'partyBasket.manage.pleaseEnterAddress',
    defaultMessage: 'Please enter a valid address',
    description: 'Prompt to user to ask them to enter a valid crypto currency wallet address (i.e. 0x12312k3jnkdfjsn)',
  })

  const noAddressToProcessText = intl.formatMessage({
    id: 'partyBasket.manage.noAddressToProcess',
    defaultMessage: 'No addresses to process',
    description: 'Error message when there is no crypto wallet address to process',
  })

  const csvValidationErrorHeader = intl.formatMessage({
    id: 'partyBasket.manage.csvValidationErrorHeader',
    defaultMessage: 'CSV Validation Errors',
    description:
      'Error message when the user uploads a CSV file that is not valid. After this, a list of errors is displayed.',
  })

  const csvRequirementText = intl.formatMessage(
    {
      id: 'partyBasket.manage.csvRequirement',
      defaultMessage: 'The CSV file needs a column titled "{csvKey}".',
      description:
        'text indicating a requirement for the CSV file that the user can upload. It needs a specific column that is passed in as a variable.',
    },
    {
      csvKey: CSV_UPLOAD_COLUMN_KEY,
    }
  )

  const rowText = intl.formatMessage({
    id: 'partyBasket.manage.rowText',
    defaultMessage: 'Row',
    description: 'Text for a row number of a CSV file',
  })

  const missingAddressColumnErrorMessage = intl.formatMessage(
    {
      id: 'partyBasket.manage.missingAddressColumnErrorMessage',
      defaultMessage:
        'No "{csvKey}" column found in uploaded CSV. Please fix your csv file by adding a column named "{csvKey}" with the desired addresses you want to whitelist & re-upload.',
      description: 'Error message when the user uploads a CSV file that is missing a specific column name.',
    },
    {
      csvKey: CSV_UPLOAD_COLUMN_KEY,
    }
  )

  const noFileSelectedText = intl.formatMessage({
    id: 'partyBasket.manage.noFileSelectedText',
    defaultMessage: 'No file selected',
    description: 'Error message when the user has not selected a file to upload',
  })

  // const shareLinkToRedeemText = intl.formatMessage({
  //   id: 'partyBasket.manage.shareLinkToRedeemText',
  //   defaultMessage: 'Share link to redeem',
  //   description: 'Text for a link to share that allows one to redeem a Lootbox NFT',
  // })
  const viewPublicPartyBasket = intl.formatMessage({
    id: 'partyBasket.manage.viewPublicPartyBasket',
    defaultMessage: 'View Public Party Basket',
    description: 'Text for a hyperlink that opens the Party Basket page to redeem a Lootbox NFT',
  })

  const successfullyWhitelisted = intl.formatMessage({
    id: 'partyBasket.manage.successfullyWhitelisted',
    defaultMessage: 'Successfully whitelisted',
    description: 'Text for a successful whitelist',
  })

  const partialErrorsMessage = intl.formatMessage({
    id: 'partyBasket.manage.partialErrorsMessage.prefix',
    defaultMessage: 'Partial Errors with Submission. Please re-whitelist the rows specified below',
    description:
      'Error message when partial errors happened with bulk whitelisting submission. We display a list of errors after this message.',
  })

  const autoWhitelistMessage = intl.formatMessage({
    id: 'partyBasket.autoWhitelist',
    defaultMessage: 'Auto Whitelist',
  })

  const advancedSubmit = async () => {
    setAdvancedError('')
    const partyBasketId: PartyBasketID | undefined = (data?.getPartyBasket as PartyBasketFE)?.partyBasket?.id
    if (!partyBasketId) {
      console.error('No party basket id')
      setAdvancedError(words.anErrorOccured)
      return
    }

    const payload: EditPartyBasketPayload = { id: partyBasketId }

    if (localName !== partyBasket.name) {
      payload.name = localName
    }

    if (localJoinCommunityUrl !== partyBasket.joinCommunityUrl) {
      payload.joinCommunityUrl = localJoinCommunityUrl
    }

    if (localNFTBounty !== partyBasket.nftBountyValue) {
      payload.nftBountyValue = localNFTBounty
    }

    if (localStatus !== partyBasket.status) {
      payload.status = localStatus
    }

    if (localMaxClaimsAllowed !== partyBasket.maxClaimsAllowed) {
      payload.maxClaimsAllowed = localMaxClaimsAllowed
    }

    if (Object.keys(payload).length === 1) {
      setAdvancedError(words.noChangesMade)
      return
    }

    try {
      const { data: responseData } = await editPartyBasket({
        variables: {
          payload,
        },
      })

      if (!responseData?.editPartyBasket || responseData?.editPartyBasket?.__typename === 'ResponseError') {
        console.error(responseData)
        throw new Error(words.anErrorOccured)
      }
    } catch (err) {
      setAdvancedError(err?.message || words.anErrorOccured)
      return
    }
  }

  const validateAddress = (address?: Address): Address => {
    if (!address) {
      throw new Error(pleaseEnterValidAddressText)
    }

    if (!ethers.utils.isAddress(address)) {
      throw new Error(pleaseEnterValidAddressText)
    }

    return address
  }

  const autoWhitelistClaims = async () => {
    if (whitelistUnassignedClaimsLoading) {
      return
    }
    const partyBasketId: PartyBasketID | undefined = (data?.getPartyBasket as PartyBasketFE)?.partyBasket?.id
    if (!partyBasketId) {
      console.error('No party basket id')
      setAutoWhitelistState({
        status: 'error',
      })
      return
    }

    try {
      const res = await whitelistUnassignedClaims({
        variables: {
          payload: {
            partyBasketId: partyBasketId,
          },
        },
      })

      if (!res || !res.data) {
        console.error('no data')
        throw new Error(words.anErrorOccured)
      }
      if (res?.data?.whitelistAllUnassignedClaims?.__typename === 'ResponseError') {
        console.error('Server error...', res?.data?.whitelistAllUnassignedClaims?.error)
        throw new Error(words.anErrorOccured)
      }

      const response = res?.data?.whitelistAllUnassignedClaims as WhitelistUnassignedClaimsFE

      if (response.errors) {
        setAutoWhitelistState({
          status: 'success',
          partialErrors: response.errors,
        })
      } else {
        setAutoWhitelistState({
          status: 'success',
        })
      }
    } catch (err) {
      setAutoWhitelistState({
        status: 'error',
      })
    }
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

        throw new Error(errs[0] || words.anErrorOccured)
      }
      setSingleWhitelistState({ status: 'success', error: undefined })
      setTimeout(() => {
        setSingleWhitelistState({ status: 'pending' })
      }, 2000)
    } catch (err) {
      console.error(err)
      setSingleWhitelistState({ status: 'error', error: err?.message || `${words.anErrorOccured}!` })
    }
  }

  const bulkWhitelistAction = async (addresses: Address[]) => {
    if (addresses.length === 0) {
      setBulkWhitelistState({ status: 'error', error: noAddressToProcessText })
      return
    }

    const preprocessingErrors = addresses
      .map((address, index) => {
        try {
          validateAddress(address)
          return undefined
        } catch (err) {
          // Index + 2 because we start at index 0 & take header into account
          return `(${rowText} ${index + 2}) ${words.error}: ${err?.message || `${words.anErrorOccured}!`}`
        }
      })
      .filter((err: string | undefined) => !!err)

    if (preprocessingErrors.length > 0) {
      setBulkWhitelistState({
        status: 'error',
        error: `${csvValidationErrorHeader}\n${preprocessingErrors.join('\n')}`,
      })
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
          .map((err, index) => (err ? `(${rowText} ${index}) ${words.error}: ${err}` : undefined))
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
      setBulkWhitelistState({ status: 'error', error: err?.message || `${words.error}!` })
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
            // error: `No "${CSV_UPLOAD_COLUMN_KEY}" column found in uploaded CSV. Please fix your csv file by adding a column named "${CSV_UPLOAD_COLUMN_KEY}" with the desired addresses you want to whitelist & re-upload.`,
            error: missingAddressColumnErrorMessage,
          })
          return
        } else if (rows.length === 0) {
          setBulkWhitelistState({
            status: 'error',
            error: noAddressToProcessText,
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
      setBulkWhitelistState({ status: 'error', error: noFileSelectedText })
    }
  }

  // const copyRedeemUrl = () => {
  //   navigator.clipboard.writeText(
  //     `${manifest.microfrontends.webflow.basketRedeemPage}?basket=${props.partyBasketAddress}`
  //   )
  //   const el = document.getElementById('share-redeem-link')
  //   if (el) {
  //     el.innerText = `✅ ${words.copiedToClipBoard}!`
  //     setTimeout(() => {
  //       el.innerText = shareLinkToRedeemText
  //     }, 2000)
  //   }
  // }

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error) {
    return <Oopsies title="Error loading Party Basket" message={error?.message || ''} icon="🤕" />
  } else if (data?.getPartyBasket?.__typename === 'ResponseError') {
    return <Oopsies title="Error loading Party Basket" message={data?.getPartyBasket?.error?.message || ''} icon="🤕" />
  }

  const partyBasket = (data?.getPartyBasket as PartyBasketFE)?.partyBasket

  const chain = NETWORK_OPTIONS.find((c) => c.chainIdHex === partyBasket.chainIdHex) || NETWORK_OPTIONS[0]

  const { name: lootboxName, address: lootboxAddress, stampImage: lootboxImage } = partyBasket.lootboxSnapshot || {}

  const network = NETWORK_OPTIONS.find((network) => network.chainIdHex === partyBasket.chainIdHex) || NETWORK_OPTIONS[0]

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
                  <FormattedMessage
                    id="partyBasket.manage.helpTooltip"
                    defaultMessage='This is your Party Basket for "{lootboxName}". You can bulk mint NFTs to this contract address, and then bulk whitelist people (with a CSV upload) to pick them up for FREE (AKA: Redeem a bounty)!'
                    description="Information message about the Party Basket"
                    values={{
                      lootboxName: lootboxName,
                    }}
                  />
                </ReactTooltip>
              </$Horizontal>
            )}
            {partyBasket.name && (
              <$Horizontal verticalCenter>
                <$ManageLootboxHeading screen={screen}>{partyBasket.name || 'Party Basket'}</$ManageLootboxHeading>
              </$Horizontal>
            )}
          </$Vertical>

          <$Horizontal spacing={2} justifyContent="space-between" flexWrap={screen === 'mobile'}>
            <$StepSubheading>
              <FormattedMessage
                id="partyBasket.manage.partyBasketDescription"
                defaultMessage='This is your Party Basket for "{lootboxName}". Party Baskets hold onto Lootbox NFTs and allow you to "whitelist" specific wallets, giving them special permission to redeem an NFT from the Party Basket for free.'
                description="Information message about the Party Basket"
                values={{
                  lootboxName: lootboxName,
                }}
              />
              <br />
              <br />
              <FormattedMessage
                id="partyBasket.manage.bulkWhitelistingDescription"
                defaultMessage="Bulk whitelisting will grant a large number of wallets a free NFT to redeem. You can use a CSV file (like {hyperlink}), and then you can upload it by clicking the button below. Your Party Basket will need to have Lootbox NFTs in it (by bulk minting) in order for your followers to be able to redeem one."
                description="Information message about bulk whitelisting. Bulk whitelisting allows you to give a large number of users permission to get a free Lootbox NFT from a Party Basket"
                values={{
                  hyperlink: (
                    <a href={exampleCSV} target="_blank" style={{ display: 'contents', textTransform: 'lowercase' }}>
                      <FormattedMessage
                        id="partyBasket.manage.helpHyperlink"
                        defaultMessage="This one"
                        description="This is a hyperlink to an example google drive file they can use"
                      />
                    </a>
                  ),
                }}
              />
            </$StepSubheading>
            {!!lootboxImage && <$LootboxPreviewImage screen={screen} src={lootboxImage || ''} />}
          </$Horizontal>

          <$Vertical spacing={3}>
            <$Vertical>
              <span>
                <$StepSubheading>
                  <FormattedMessage
                    id="partyBasket.manage.bulkWhitelisting.address.header"
                    defaultMessage="Whitelist Address"
                    description='Title for whitelisting section. "Whitelist" means to give someone permission to get a free Lootbox NFT from your Party Basket'
                  />
                  <HelpIcon tipID="whitelistAddress" />
                  <ReactTooltip id="whitelistAddress" place="right" effect="solid">
                    <FormattedMessage
                      id="partyBasket.manage.bulkWhitelisting.description"
                      defaultMessage="Whitelisting is a feature that allows give away an NFT for free. The address you specify will be able to redeem this ONE TIME, and your Lootbox Bounty NFT will be transfered to them when they redeem it."
                      description="Paragraph descibing what whitelisting is."
                    />
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
                      textTransform: 'uppercase',
                    }}
                  >
                    {bulkWhitelistLoading ? words.loading : words.add}
                  </$ManageLootboxHeading>
                </$AddWhitelistButton>
              </$Horizontal>
            </$Vertical>

            {singleWhitelistState?.status === 'error' && singleWhitelistState?.error && (
              <$ErrorText>{singleWhitelistState.error}</$ErrorText>
            )}
            {singleWhitelistState?.status === 'success' && (
              <$StepSubheading style={{ textAlign: 'center', display: 'inline' }}>
                ✅ {successfullyWhitelisted}!
              </$StepSubheading>
            )}
            <br />
            <$Vertical>
              <$StepSubheading
                style={{
                  width: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                <FormattedMessage
                  id="partyBasket.manage.authWhitelistClaims.header"
                  defaultMessage="Auto Whitelist Claims"
                  description="Title for bulk whitelisting section."
                />
                <HelpIcon tipID="autoWhitelist" />
                <ReactTooltip id="autoWhitelist" place="right" effect="solid">
                  <FormattedMessage
                    id="partyBasket.manage.authWhitelistClaims.descriptionTooltip"
                    defaultMessage="Clicking this will automatically whitelist all users with a completed Claim. The user must have attached a metamask wallet to their account for it to work. Clicking this button multiple times is SAFE and will not duplicate whitelists."
                  />
                </ReactTooltip>
              </$StepSubheading>
              <$BasketButton themeColor={chain.themeColor} screen={screen} onClick={autoWhitelistClaims}>
                <LoadingText
                  loading={whitelistUnassignedClaimsLoading}
                  text={autoWhitelistMessage}
                  color={chain.themeColor}
                />
              </$BasketButton>

              {(autoWhitelistState?.status === 'success' ||
                autoWhitelistState?.status === 'error' ||
                (autoWhitelistState?.partialErrors && autoWhitelistState.partialErrors.length > 0)) && <br />}

              {autoWhitelistState?.status === 'success' && (
                <$StepSubheading style={{ display: 'inline' }}>✅ {successfullyWhitelisted}!</$StepSubheading>
              )}
              {autoWhitelistState?.status === 'error' && (
                <$StepSubheading style={{ display: 'inline', whiteSpace: 'pre-line' }}>
                  ❌ {`${words.anErrorOccured}!`}
                </$StepSubheading>
              )}
              {autoWhitelistState?.partialErrors && autoWhitelistState.partialErrors.length > 0 && (
                <$StepSubheading style={{ display: 'inline', whiteSpace: 'pre-line' }}>
                  ⚠️ {`Some errors occured!\n\n${autoWhitelistState?.partialErrors?.join('\n')}`}
                </$StepSubheading>
              )}
            </$Vertical>
            <$Vertical>
              <$Horizontal>
                <$StepSubheading
                  style={{
                    width: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <FormattedMessage
                    id="partyBasket.manage.bulkWhitelisting.header"
                    defaultMessage="Bulk Whitelist Address"
                    description="Title for bulk whitelisting section."
                  />
                  <HelpIcon tipID="bulkWhitelist" />
                  <ReactTooltip id="bulkWhitelist" place="right" effect="solid">
                    <FormattedMessage
                      id="partyBasket.manage.bulkWhitelisting.descriptionTooltip"
                      defaultMessage='Upload a ".csv" file of addresses to whitelist. {csvRequirementText}. These addresses will get whitelisted which will allow each address to pick up their own NFT (without requiring you to send it to them). Whitelisting an addThis will allow yWhitelisting is a feature that allows give away an NFT for free. The address you specify will be able to redeem this ONE TIME, and your Lootbox Bounty NFT will be transfered to them when they redeem it.'
                      description=""
                      values={{
                        csvRequirementText: (
                          <span style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>{csvRequirementText}</span>
                        ),
                      }}
                    />
                  </ReactTooltip>
                </$StepSubheading>
                <$StepSubheadingExtra
                  style={{ fontStyle: 'italic', textDecoration: 'underline' }}
                  href={exampleCSV}
                  target="_blank"
                >
                  <FormattedMessage
                    id="partyBasket.manage.viewExampleCSV.button"
                    defaultMessage="View Sample CSV"
                    description="Button to view an example CSV file"
                  />
                </$StepSubheadingExtra>
              </$Horizontal>

              <$CSVLabel htmlFor="csv-upload" themeColor={chain.themeColor} screen={screen}>
                <FormattedMessage
                  id="partyBasket.manage.bulkWhitelisting.uploadCSVText"
                  defaultMessage="Upload CSV"
                  description="Label for CSV upload button"
                />
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
                <Spinner color={`${COLORS.surpressedFontColor}ae`} size="30px" /> {words.processing}...
              </$StepSubheading>
            )}

            {bulkWhitelistState?.status === 'success' && (
              <$StepSubheading style={{ display: 'inline' }}>✅ {successfullyWhitelisted}!</$StepSubheading>
            )}
            {(bulkWhitelistState?.status === 'error' || bulkWhitelistState?.error) && (
              <$StepSubheading style={{ display: 'inline', whiteSpace: 'pre-line' }}>
                ❌ {bulkWhitelistState?.error || `${words.anErrorOccured}!`}
              </$StepSubheading>
            )}
            {bulkWhitelistState?.partialErrors && (
              <$StepSubheading style={{ display: 'inline', whiteSpace: 'pre-line' }}>
                ⚠️ {`${partialErrorsMessage}.\n\n${bulkWhitelistState?.partialErrors?.join('\n')}`}
              </$StepSubheading>
            )}

            <br />

            {/* <$BasketButton id="share-redeem-link" themeColor={chain.themeColor} screen={screen} onClick={copyRedeemUrl}>
              🔗 {shareLinkToRedeemText}
            </$BasketButton> */}
            <$BasketButton id="share-redeem-link" themeColor={chain.themeColor} screen={screen}>
              <a
                style={{ textDecoration: 'none', color: 'inherit' }}
                href={`${manifest.microfrontends.webflow.basketRedeemPage}?basket=${props.partyBasketAddress}`}
              >
                🔗 {viewPublicPartyBasket}
              </a>
            </$BasketButton>
            <$BasketLink
              themeColor={chain.themeColor}
              screen={screen}
              href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootboxAddress}`}
            >
              {words.view} Lootbox
            </$BasketLink>

            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  <FormattedMessage
                    id="partyBasket.manage.viewWhitelistedWallets.header"
                    defaultMessage="View All Whitelisted Wallets"
                    description="Title for whitelisted wallets section."
                  />

                  <HelpIcon tipID="allWhite" />
                  <ReactTooltip id="allWhite" place="right" effect="solid">
                    <FormattedMessage
                      id="partyBasket.manage.viewWhitelistedWallets.descriptionTooltip"
                      defaultMessage="Download a .csv file that contains a list of all the whitelisted addresses for this Party Box."
                      description="Tooltip for whitelisted wallets section"
                    />
                  </ReactTooltip>
                </$StepSubheading>
              </span>
              <$BasketButton themeColor={chain.themeColor} screen={screen}>
                <FormattedMessage
                  id="partyBasket.manage.viewWhitelistedWallets.button"
                  defaultMessage="Download CSV"
                  description="Button to download a CSV file of all whitelisted addresses"
                />
              </$BasketButton>
            </$Vertical>
            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  <FormattedMessage
                    id="partyBasket.manage.details.address"
                    defaultMessage="Party Basket Address"
                    description="Header for the Party Basket address section"
                  />
                  <HelpIcon tipID="pbAddr" />
                  <ReactTooltip id="pbAddr" place="right" effect="solid">
                    <FormattedMessage
                      id="partyBasket.manage.details.address.descriptionTooltip"
                      defaultMessage="This is the address of the Party Basket. It is a smart contract on the blockchain."
                      description="Tooltip for the Party Basket address section"
                    />
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
      {!!user?.id && user?.id === partyBasket.creatorId ? (
        <$StepCard screen={screen} themeColor={network.themeColor} style={{ marginTop: '40px' }}>
          <$Vertical spacing={4}>
            <$ManageLootboxHeading screen={screen}>Advanced Settings</$ManageLootboxHeading>
            <$Vertical spacing={2}>
              <span>
                <$StepSubheading>
                  <FormattedMessage
                    id="partyBasket.manage.input.name"
                    defaultMessage="Party Basket Name"
                    description="Input field for the party basket name form"
                  />
                </$StepSubheading>
              </span>

              <$InputWrapper
                screen={screen}
                marginRight="0px"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <$Input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e?.target?.value)}
                    min="0"
                    screen={screen}
                    style={{ fontWeight: 'lighter' }}
                  />
                </div>
              </$InputWrapper>
            </$Vertical>

            <$Vertical spacing={2}>
              <span>
                <$StepSubheading>
                  <FormattedMessage id="partyBasket.manage.input.nftBountyValue" defaultMessage="Bounty Value" />
                </$StepSubheading>
              </span>

              <$InputWrapper
                screen={screen}
                marginRight="0px"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <$Input
                    type="text"
                    value={localNFTBounty}
                    onChange={(e) => setLocalNFTBounty(e?.target?.value)}
                    placeholder="e.g. $2 USD"
                    screen={screen}
                    style={{ fontWeight: 'lighter' }}
                  />
                </div>
              </$InputWrapper>
            </$Vertical>

            <$Vertical spacing={2}>
              <span>
                <$StepSubheading>
                  <FormattedMessage id="partyBasket.manage.input.joinCommunity" defaultMessage="Community URL" />
                  <HelpIcon tipID="pbcommunity" />
                  <ReactTooltip id="pbcommunity" place="right" effect="solid">
                    <FormattedMessage
                      id="partyBasket.manage.input.communityUrl.descriptionTooltip"
                      defaultMessage={`URL of the community to join. Users will be directed to this link after accepting the lottery ticket.`}
                    />
                  </ReactTooltip>
                </$StepSubheading>
              </span>

              <$InputWrapper
                screen={screen}
                marginRight="0px"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <$Input
                    type="text"
                    value={localJoinCommunityUrl}
                    onChange={(e) => setLocalJoinCommunityUrl(e?.target?.value)}
                    screen={screen}
                    style={{ fontWeight: 'lighter' }}
                  />
                </div>
              </$InputWrapper>
            </$Vertical>
            <$Horizontal flexWrap={screen === 'mobile'} width="100%" spacing={2}>
              <$Vertical spacing={2} width={screen === 'mobile' ? '80%' : '50%'}>
                <span>
                  <$StepSubheading>
                    <FormattedMessage id="partyBasket.manage.input.status" defaultMessage="Current Status" />
                    <HelpIcon tipID="pbstatus" />
                    <ReactTooltip id="pbstatus" place="right" effect="solid">
                      <FormattedMessage
                        id="partyBasket.manage.input.status.descriptionTooltip"
                        defaultMessage={`
                      Active:{newline}{newline}
                        - party basket is browseable in the tournament pages{newline}
                        - party basket is in the viral referral program{newline}{newline}

                      Disabled:{newline}{newline}
                        - removes party basket from tournament pages{newline}
                        - removes from viral referral flow{newline}{newline}
                    
                      Sold out:{newline}{newline}
                        - removes from viral referral flow
                        - party basket still visible on tournament pages

                    `}
                        values={{ newline: <br /> }}
                      />
                    </ReactTooltip>
                  </$StepSubheading>
                </span>

                <$InputWrapper
                  screen={screen}
                  marginRight="0px"
                  style={{
                    // width: '100%',
                    boxSizing: 'border-box',
                    maxWidth: '300px',
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                  }}
                >
                  <$Select
                    screen={screen}
                    style={{
                      fontWeight: TYPOGRAPHY.fontWeight.light,
                      textTransform: 'capitalize',
                      height: screen === 'desktop' ? '70px' : '50px',
                    }}
                    onChange={(e) => setLocalStatus(e.target.value as PartyBasketStatus)}
                    value={localStatus}
                  >
                    {Object.values(PartyBasketStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </$Select>
                </$InputWrapper>
              </$Vertical>

              <$Vertical spacing={2} width={screen === 'mobile' ? '80%' : '50%'}>
                {screen === 'mobile' && <br />}
                <span>
                  <$StepSubheading>
                    {words.maximumNumberOfClaims}
                    <HelpIcon tipID="pbMaxClaimsAllowed" />
                    <ReactTooltip id="pbMaxClaimsAllowed" place="right" effect="solid">
                      {words.maxNumberClaimsDescription}
                    </ReactTooltip>
                  </$StepSubheading>
                </span>

                <$InputWrapper
                  screen={screen}
                  marginRight="0px"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    maxWidth: '300px',
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                  }}
                >
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <$Input
                      type="text"
                      value={localMaxClaimsAllowed}
                      onChange={(e) => setLocalMaxClaimsAllowed(Number(e?.target?.value || 0))}
                      screen={screen}
                      style={{ fontWeight: 'lighter' }}
                    />
                  </div>
                </$InputWrapper>
              </$Vertical>
            </$Horizontal>

            <$AddWhitelistButton
              themeColor={network.themeColor}
              // onClick={singleWhitelistAction}
              disabled={editPartyBasketLoading}
              onClick={advancedSubmit}
              screen={screen}
            >
              <$ManageLootboxHeading
                screen={screen}
                style={{
                  color: '#ffffff',
                  margin: 'auto 0px',
                  fontSize: '1.5rem',
                  textTransform: 'uppercase',
                }}
              >
                {editPartyBasketLoading ? words.loading : words.saveChanges}
              </$ManageLootboxHeading>
            </$AddWhitelistButton>
            {advancedError && <$ErrorMessage>{advancedError}</$ErrorMessage>}
          </$Vertical>
        </$StepCard>
      ) : null}
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

const $ManagePartyBasket = styled.div`
  width: 100%;
`

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

const $LootboxPreviewImage = styled.img<{ screen: ScreenSize }>`
  width: 30%;
  min-width: 220px;
  ${(props) => props.screen === 'mobile' && 'padding-top: 20px;'}
`

export const $Select = styled.select<{ screen: ScreenSize; width?: string; fontWeight?: string; disabled?: boolean }>`
  flex: 1;
  height: ${(props) => (props.screen === 'desktop' ? '50px' : '40px')};
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px 10px')};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xxlarge : TYPOGRAPHY.fontSize.xlarge)};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : TYPOGRAPHY.fontWeight.bold)};
  border: 0px solid transparent;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0);
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  width: ${(props) => (props.width ? props.width : '100%')};
  min-width: 70px;
  max-width: ${(props) => (props.width ? props.width : '100%')};
  -moz-appearance: textfield;
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ${(props) => props.disabled && 'cursor: not-allowed;'}
`

export default ManagePartyBasketPage
