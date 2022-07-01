import { useMutation } from '@apollo/client'
import { Address, COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { createPartyBasket } from 'lib/api/createPartyBasket'
import { CreatePartyBasketPayload } from 'lib/api/graphql/generated/types'
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
import { CREATE_PARTY_BASKET } from './api.gql'
import ReactTooltip from 'react-tooltip'

type PartyBasketSubmissionStatus = 'pending' | 'success' | 'error' | 'ready'
interface PartyBasketSubmission {
  status: PartyBasketSubmissionStatus
  error?: string
}
interface CreatePartyBasketProps {
  lootboxAddress: Address
  network: NetworkOption
}

const CreatePartyBasket = (props: CreatePartyBasketProps) => {
  const { screen } = useWindowSize()
  const [partyBasketName, setPartyBasketName] = useState('')
  const [partyBasketSubmissionStatus, setPartyBasketSubmissionStatus] = useState<PartyBasketSubmission>({
    status: 'ready',
  })
  const [bountyPrize, setBountyPrize] = useState<string>('')

  const [provider, loading] = useProvider()
  const snapUserState = useSnapshot(userState)
  const [createPartyBasketMutation] = useMutation(CREATE_PARTY_BASKET, {
    refetchQueries: [{ query: GET_MY_PARTY_BASKETS, variables: { address: props.lootboxAddress } }],
  })

  const createPartyBasketCall = async () => {
    setPartyBasketSubmissionStatus({ status: 'pending' })
    try {
      if (!partyBasketName) {
        throw new Error('Please enter a name for your party basket')
      }

      if (!snapUserState?.network?.currentNetworkIdHex || !snapUserState.currentAccount) {
        throw new Error('Please connect your wallet')
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
            await createPartyBasketMutation({
              variables: {
                payload: {
                  name: data.name,
                  address: data.address,
                  factory: data.factory,
                  chainIdHex: data.chainIdHex,
                  lootboxAddress: data.lootboxAddress,
                  creatorAddress: data.creatorAddress,
                  nftBountyValue: bountyPrize,
                },
              },
            })
            setPartyBasketSubmissionStatus({ status: 'success' })
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
        <$StepSubheading>Party Basket Name</$StepSubheading>
        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <$Input
              type="text"
              value={partyBasketName}
              onChange={(e) => setPartyBasketName(e.target.value)}
              min="0"
              placeholder="Name your Party Basket"
              screen={screen}
              style={{ fontWeight: 'lighter' }}
            />
          </div>
        </$InputWrapper>
      </$Vertical>
      <$Vertical>
        <$Horizontal verticalCenter>
          <$StepSubheading style={{ width: 'auto' }}>NFT Prize Value</$StepSubheading>
          <HelpIcon tipID="bountyPrize" />
          <ReactTooltip id="bountyPrize" place="right" effect="solid">
            You determine how much
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

      <$StepSubheading
        style={{
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          textDecoration: 'underline',
          textDecorationThickness: 'from-font',
        }}
      >
        ⚠️ IMPORTANT ⚠️ Please Read
      </$StepSubheading>

      <span>
        <$StepSubheading style={{ display: 'inline' }}>Click here 👉 </$StepSubheading>

        <$StepSubheading
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            textDecoration: 'underline',
            textDecorationThickness: 'from-font',
            display: 'inline',
            cursor: 'pointer',
          }}
          onClick={() => {
            window.open('https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC', '__blank')
          }}
        >
          Watch Party Basket Tutorial
        </$StepSubheading>
      </span>

      <$StepSubheading>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
        aute irure dolor in reprehenderit in voluptate
      </$StepSubheading>

      <$CreatePartyBasketButton
        disabled={partyBasketSubmissionStatus.status === 'pending' || partyBasketSubmissionStatus.status === 'success'}
        allConditionsMet={true}
        onClick={createPartyBasketCall}
        themeColor={
          partyBasketSubmissionStatus.status === 'success'
            ? COLORS.successFontColor
            : partyBasketSubmissionStatus.status === 'pending'
            ? `${props.network.themeColor}3A`
            : props.network.themeColor
        }
      >
        {partyBasketSubmissionStatus.status === 'pending'
          ? 'SUBMITTING...'
          : partyBasketSubmissionStatus.status === 'success'
          ? 'SUCCESS'
          : `CREATE PARTY BASKET`}
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
