import { useMutation } from '@apollo/client'
import { Address, COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { createPartyBasket } from 'lib/api/createPartyBasket'
import { CreatePartyBasketPayload, MutationCreatePartyBasketArgs, ResponseError } from 'lib/api/graphql/generated/types'
import { NetworkOption } from 'lib/api/network'
import { $ErrorText } from 'lib/components/BuyShares/PurchaseComplete'
import { $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { $InputWrapper } from 'lib/components/CreateLootbox/StepChooseFunding'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import $Input from 'lib/components/Generics/Input'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useProvider } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { useState } from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { GET_MY_PARTY_BASKETS } from '../ViewPartyBaskets/api.gql'
import { CREATE_PARTY_BASKET, CreatePartyBasketFE } from './api.gql'
import ReactTooltip from 'react-tooltip'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'

type PartyBasketSubmissionStatus = 'pending' | 'success' | 'error' | 'ready'
interface PartyBasketSubmission {
  status: PartyBasketSubmissionStatus
  error?: string
}
interface CreatePartyBasketProps {
  lootboxAddress: Address
  network: NetworkOption
  successCallback?: (partyBasketAddress: Address) => void
}

const CreatePartyBasket = (props: CreatePartyBasketProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const [partyBasketName, setPartyBasketName] = useState('')
  const [joinCommunityUrl, setJoinCommunityUrl] = useState('')
  const [partyBasketSubmissionStatus, setPartyBasketSubmissionStatus] = useState<PartyBasketSubmission>({
    status: 'ready',
  })
  const [bountyPrize, setBountyPrize] = useState<string>('')

  const [provider, loading] = useProvider()
  const snapUserState = useSnapshot(userState)
  const [createPartyBasketMutation] = useMutation<
    { createPartyBasket: ResponseError | CreatePartyBasketFE },
    MutationCreatePartyBasketArgs
  >(CREATE_PARTY_BASKET, {
    refetchQueries: [{ query: GET_MY_PARTY_BASKETS, variables: { address: props.lootboxAddress } }],
  })

  const enterPartyBasketNameText = intl.formatMessage({
    id: 'partyBasket.create.form.enterPartyBasketName',
    defaultMessage: 'Please enter a name for your party basket',
    description: 'Error text when user tries making Party Basket without a name',
  })

  const nameYourPartyBasketText = intl.formatMessage({
    id: 'partyBasket.create.form.nameYourPartyBasket',
    defaultMessage: 'Name your Party Basket',
    description: 'Placeholder label for Party Basket name input',
  })

  const createPartyBasketCall = async () => {
    setPartyBasketSubmissionStatus({ status: 'pending' })
    try {
      if (!partyBasketName) {
        throw new Error(enterPartyBasketNameText)
      }

      if (!snapUserState?.network?.currentNetworkIdHex || !snapUserState.currentAccount) {
        throw new Error(words.connectWalletToMetamask)
      }

      await createPartyBasket(
        provider,
        {
          name: partyBasketName,
          lootboxAddress: props.lootboxAddress,
          admin: snapUserState.currentAccount,
        },
        async (data: CreatePartyBasketPayload) => {
          try {
            const res = await createPartyBasketMutation({
              variables: {
                payload: {
                  name: data.name,
                  address: data.address,
                  factory: data.factory,
                  chainIdHex: data.chainIdHex,
                  lootboxAddress: data.lootboxAddress,
                  creatorAddress: data.creatorAddress,
                  nftBountyValue: bountyPrize,
                  joinCommunityUrl: joinCommunityUrl,
                },
              },
            })
            if (!res?.data || res?.data?.createPartyBasket?.__typename === 'ResponseError') {
              // @ts-ignore
              throw new Error(res?.data?.createPartyBasket?.error?.message || words.anErrorOccured)
            }
            setPartyBasketSubmissionStatus({ status: 'success' })
            if (props.successCallback) {
              props.successCallback(data.address as Address)
            }
          } catch (err) {
            console.error(err)
            setPartyBasketSubmissionStatus({ status: 'error', error: err?.message || '' })
          }
        },
        snapUserState.network.currentNetworkIdHex
      )
    } catch (err) {
      console.error(err)
      setPartyBasketSubmissionStatus({ status: 'error', error: err?.message || '' })
    }
  }

  return (
    <$Vertical spacing={4}>
      <$Vertical>
        <$StepSubheading style={{ textTransform: 'capitalize' }}>
          <FormattedMessage
            id="partyBasket.create.form.name.title"
            defaultMessage="Party basket name"
            description="Input text for Party Basket Name field in form"
          />
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <$Input
              type="text"
              value={partyBasketName}
              onChange={(e) => setPartyBasketName(e.target.value)}
              min="0"
              placeholder={nameYourPartyBasketText}
              screen={screen}
              style={{ fontWeight: 'lighter' }}
            />
          </div>
        </$InputWrapper>
      </$Vertical>
      <$Vertical>
        <$Horizontal verticalCenter>
          <$StepSubheading style={{ width: 'auto', textTransform: 'capitalize' }}>
            <FormattedMessage
              id="partyBasket.create.form.prize.title"
              defaultMessage="NFT prize value"
              description="Input text for NFT Prize Value field"
            />
          </$StepSubheading>
          <HelpIcon tipID="bountyPrize" />
          <ReactTooltip id="bountyPrize" place="right" effect="solid">
            <FormattedMessage
              id="partyBasket.create.form.prize.tooltip"
              defaultMessage='You determine how much each NFT bounty will be worth. You can specify crypto currencies like "10 Matic" or fiat like "$10 USD"'
              description="Tooltip for NFT Prize Value field"
            />
          </ReactTooltip>
        </$Horizontal>

        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <$Input
              type="text"
              value={bountyPrize}
              onChange={(e) => setBountyPrize(e.target.value)}
              placeholder="e.g. 150 SLP"
              screen={screen}
              style={{ fontWeight: 'lighter' }}
            />
          </div>
        </$InputWrapper>
      </$Vertical>

      <$Vertical>
        <$Horizontal verticalCenter>
          <$StepSubheading style={{ width: 'auto', textTransform: 'capitalize' }}>
            <FormattedMessage
              id="partyBasket.create.form.socialLink.title"
              defaultMessage="Add a link to your community"
            />
          </$StepSubheading>
          <HelpIcon tipID="joinCommunityUrl" />
          <ReactTooltip id="joinCommunityUrl" place="right" effect="solid">
            <FormattedMessage
              id="partyBasket.create.form.socialLink.tooltip"
              defaultMessage="Direct users to your community by adding a link to your community page."
              description="Tooltip for NFT Prize Value field"
            />
          </ReactTooltip>
        </$Horizontal>

        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <$Input
              type="text"
              value={joinCommunityUrl}
              onChange={(e) => setJoinCommunityUrl(e.target.value)}
              placeholder="link to join your community"
              screen={screen}
              style={{ fontWeight: 'lighter' }}
            />
          </div>
        </$InputWrapper>
      </$Vertical>

      <$StepSubheading
        style={{
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          textDecoration: 'underline',
          textDecorationThickness: 'from-font',
        }}
      >
        <FormattedMessage
          id="partyBasket.create.form.disclaimer.title"
          defaultMessage="{icon} IMPORTANT {icon} Please Read"
          description="Disclaimer title for Party Basket creation form"
          values={{
            icon: '⚠️',
          }}
        />
      </$StepSubheading>

      <span>
        <$StepSubheading style={{ display: 'inline' }}>{words.clickHere} 👉 </$StepSubheading>

        <$StepSubheading
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            textDecoration: 'underline',
            textDecorationThickness: 'from-font',
            fontStyle: 'italic',
            display: 'inline',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
          onClick={() => {
            window.open('https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC', '__blank')
          }}
        >
          <FormattedMessage
            id="partyBasket.create.form.disclaimer.link"
            defaultMessage="Watch Party Basket tutorial"
            description="Hyperlink to watch tutorial videos about Party Basket"
          />
        </$StepSubheading>
      </span>

      <$StepSubheading>
        <FormattedMessage
          id="partyBasket.create.form.disclaimer.text"
          defaultMessage="You are creating a Party Basket on the blockchain. Use Party Baskets to hold onto your bulk minted NFTs which you can then give away for free or for completing bounties."
          description="Disclaimer text for Party Basket creation form"
        />
      </$StepSubheading>

      <$CreatePartyBasketButton
        disabled={partyBasketSubmissionStatus.status === 'pending' || partyBasketSubmissionStatus.status === 'success'}
        allConditionsMet={true}
        onClick={createPartyBasketCall}
        style={{ textTransform: 'uppercase' }}
        themeColor={
          partyBasketSubmissionStatus.status === 'success'
            ? COLORS.successFontColor
            : partyBasketSubmissionStatus.status === 'pending'
            ? `${props.network.themeColor}3A`
            : props.network.themeColor
        }
      >
        {partyBasketSubmissionStatus.status === 'pending'
          ? `${words.submitting}...`
          : partyBasketSubmissionStatus.status === 'success'
          ? words.success
          : words.createAPartyBasket}
      </$CreatePartyBasketButton>
      {partyBasketSubmissionStatus.status === 'error' && partyBasketSubmissionStatus.error && (
        <$ErrorText>{partyBasketSubmissionStatus.error}</$ErrorText>
      )}
    </$Vertical>
  )
}

const $CreatePartyBasketButton = styled.button<{ themeColor?: string; allConditionsMet: boolean }>`
  background-color: ${(props) => (props.allConditionsMet ? props.themeColor : `${props.themeColor}30`)};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  text-transform: uppercase;
  cursor: ${(props) => (props.allConditionsMet ? 'pointer' : 'not-allowed')};
  color: ${(props) => (props.allConditionsMet ? COLORS.white : `${props.themeColor}40`)};
  font-weight: 600;
  font-size: 1.5rem;
  border: 0px;
  padding: 20px;
`
export default CreatePartyBasket
