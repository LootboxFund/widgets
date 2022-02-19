import React, { useEffect, useState } from 'react'
import StepTermsConditions, { StepTermsConditionsProps } from 'lib/components/CreateLootbox/StepTermsConditions'
import { StepStage } from 'lib/components/StepCard'
import LOOTBOX_FACTORY_ABI from 'lib/abi/LootboxFactory.json';
import { useWeb3, useWeb3Eth, useWeb3Utils } from 'lib/hooks/useWeb3Api';
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio';
import Web3 from 'web3';


export default {
  title: 'CreateLootbox Step - Terms',
  component: StepTermsConditions,
}


const Demo = (args: StepTermsConditionsProps) => {
  const snapUserState = useSnapshot(userState)
  const web3Utils = useWeb3Utils()
  const web3Eth = useWeb3Eth()
  const INITIAL_TERMS: Record<string, boolean> = {
    agreeEthics: false,
    agreeLiability: false,
    agreeVerify: false
  }
  const reputationWallet = "0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A"
  const [treasuryWallet, setTreasuryWallet] = useState("0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A")
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [termsState, setTermsState] = useState(INITIAL_TERMS);
  useEffect(() => {
    (window as any).Web3 = Web3
  }, [])
  useEffect(() => {
    if (termsState.agreeEthics && termsState.agreeLiability && termsState.agreeVerify && treasuryWallet) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [termsState])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' }

  const updateTermsState = (slug: string, bool: boolean) => {
    setTermsState({ ...termsState, [slug]: bool })
  }

  const createLootbox = async () => {
    console.log(`creating lootbox...`)
    const receivingWallet = "0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A"
    const LOOTBOX_FACTORY_ADDRESS = "0x3CA4819532173db8D15eFCf0dd2C8CFB3F0ECDD0"
    console.log(`snapUserState.currentAccount = ${snapUserState.currentAccount}`)
    const lootbox = new web3Eth.Contract(
      LOOTBOX_FACTORY_ABI,
      LOOTBOX_FACTORY_ADDRESS,
      { from: snapUserState.currentAccount, gas: '1000000' }
    )
    try {
      const x = await lootbox.methods.createLootbox(
        "name",
        "symbol",
        "5000000000000000000000", // uint256 _maxSharesSold,
        "7000000", // uint256 _sharePriceUSD,
        receivingWallet,
        receivingWallet
      ).send();
      console.log(x)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepTermsConditions
        setValidity={(valid: boolean) => { }}
        allConditionsMet={stage === "may_proceed"}
        termsState={termsState}
        updateTermsState={updateTermsState}
        selectedNetwork={network}
        stage={stage}
        reputationWallet={reputationWallet}
        treasuryWallet={treasuryWallet}
        updateTreasuryWallet={setTreasuryWallet}
        onNext={() => console.log("onNext")}
        onSubmit={() => createLootbox()}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
