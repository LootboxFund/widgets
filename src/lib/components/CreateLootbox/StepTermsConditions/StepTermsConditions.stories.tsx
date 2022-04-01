import React, { useEffect, useState } from 'react'
import StepTermsConditions, {
  StepTermsConditionsProps,
  SubmitStatus,
} from 'lib/components/CreateLootbox/StepTermsConditions'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
import LOOTBOX_ESCROW_FACTORY_ABI from 'lib/abi/LootboxEscrowFactory.json'
import { initDApp, useEthers, useProvider, useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import Web3 from 'web3'
import { Address, convertHexToDecimal } from '@wormgraph/helpers'
import { createTokenURIData } from 'lib/api/storage'

export default {
  title: 'CreateLootbox Step - Terms',
  component: StepTermsConditions,
}

const Demo = (args: StepTermsConditionsProps) => {
  const snapUserState = useSnapshot(userState)
  const web3Utils = useWeb3Utils()
  const [provider, loading] = useProvider()
  const INITIAL_TERMS: Record<string, boolean> = {
    agreeEthics: false,
    agreeLiability: false,
    agreeVerify: false,
  }
  const ethers = useEthers()
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('unsubmitted')
  const reputationWallet = '0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A' as Address
  const [treasuryWallet, setTreasuryWallet] = useState('0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A' as Address)
  const [stage, setStage] = useState<StepStage>('in_progress')
  const [termsState, setTermsState] = useState(INITIAL_TERMS)
  useEffect(() => {
    initDApp().catch((err) => console.error(err))
  }, [])
  useEffect(() => {
    if (termsState.agreeEthics && termsState.agreeLiability && termsState.agreeVerify && treasuryWallet) {
      setStage('may_proceed')
    } else {
      setStage('in_progress')
    }
  }, [termsState])
  const network = {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: 'a',
    chainIdDecimal: '',
    isAvailable: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
  }

  const [lootboxAddress, setLootboxAddress] = useState<Address>()
  const updateTermsState = (slug: string, bool: boolean) => {
    setTermsState({ ...termsState, [slug]: bool })
  }

  const createLootbox = async () => {
    if (!provider) {
      throw new Error('No provider')
    }
    setSubmitStatus('in_progress')
    const LOOTBOX_FACTORY_ADDRESS = '0x3CA4819532173db8D15eFCf0dd2C8CFB3F0ECDD0'
    const blockNum = await provider.getBlockNumber()
    const fundraisingTarget = '10000000000000000000000'
    const receivingWallet = '0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A'

    const signer = await provider.getSigner()
    const lootbox = new ethers.Contract(LOOTBOX_FACTORY_ADDRESS, LOOTBOX_ESCROW_FACTORY_ABI, signer)
    try {
      const x = await lootbox
        .connect(signer)
        .createLootbox(
          'name',
          'symbol',
          '5000000000000000000000', // uint256 _maxSharesSold,
          '7000000', // uint256 _sharePriceUSD,
          receivingWallet,
          receivingWallet
        )
        .send()
      console.log(`--- createLootbox ---`)
      console.log(x)
      console.log(`------`)
      let options = {
        filter: {
          value: [],
        },
        fromBlock: blockNum,
        topics: [web3Utils.sha3('LootboxCreated(string,address,address,address,uint256,uint256)')],
        from: snapUserState.currentAccount,
      }
      lootbox.events.LootboxCreated(options).on('data', (event: any) => {
        const { issuer, lootbox, lootboxName, maxSharesSold, sharePriceUSD, treasury } = event.returnValues

        if (issuer === snapUserState.currentAccount && treasury === receivingWallet) {
          console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created a lootbox!
          Lootbox Address: ${lootbox}
  
          ---------------
          
          `)
          setLootboxAddress(lootbox)
          setSubmitStatus('success')
          const basisPointsReturnTarget = new web3Utils.BN('10')
            .add(new web3Utils.BN('100')) // make it whole
            .mul(new web3Utils.BN('10').pow(new web3Utils.BN((8 - 6).toString())))
            .mul(fundraisingTarget)
            .div(new web3Utils.BN('10').pow(new web3Utils.BN('8')))
          console.log(`basisPointsReturnTarget = ${basisPointsReturnTarget}`)
          createTokenURIData({
            address: lootbox,
            name: lootboxName,
            description: 'description',
            image: 'logo.png',
            backgroundColor: '#F0B90B',
            backgroundImage: 'background.png',
            lootbox: {
              address: lootbox,
              chainIdHex: 'chainIdHex',
              chainIdDecimal: 'chainIdDecimal',
              chainName: 'chainName',
              targetPaybackDate: new Date(),
              fundraisingTarget,
              fundraisingTargetMax: fundraisingTarget,
              basisPointsReturnTarget: '10',
              returnAmountTarget: basisPointsReturnTarget.toString(),
              pricePerShare: '6000000',
              lootboxThemeColor: '#000000',
              transactionHash: event.transactionHash as string,
              blockNumber: event.blockNumber,
            },
            socials: {
              twitter: '',
              email: '',
              instagram: '',
              tiktok: '',
              facebook: '',
              discord: '',
              youtube: '',
              snapchat: '',
              twitch: '',
              web: '',
            },
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepTermsConditions
        setValidity={(valid: boolean) => {}}
        allConditionsMet={stage === 'may_proceed'}
        termsState={termsState}
        updateTermsState={updateTermsState}
        selectedNetwork={network}
        stage={stage}
        reputationWallet={reputationWallet}
        treasuryWallet={treasuryWallet}
        updateTreasuryWallet={setTreasuryWallet}
        onNext={() => console.log('onNext')}
        submitStatus={submitStatus}
        onSubmit={() => createLootbox()}
        goToLootboxAdminPage={() => 'goToLootboxAdminPage'}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
