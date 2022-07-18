import React, { useState } from 'react'
import QuickCreate, { QuickCreateProps } from 'lib/components/QuickCreate'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'
import { ContractAddress } from '@wormgraph/helpers'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import Modal from 'react-modal'

export default {
  title: 'QuickCreate',
  component: QuickCreate,
}
const network = {
  name: 'Polygon',
  symbol: 'MATIC',
  themeColor: '#8F5AE8',
  chainIdHex: '0x13881',
  chainIdDecimal: '80001',
  isAvailable: true,
  isTestnet: true,
  icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC_COLORED.png?alt=media',
  priceFeed: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada' as ContractAddress,
  faucetUrl: 'https://faucet.polygon.technology/',
  blockExplorerUrl: 'https://mumbai.polygonscan.com/',
}
const Demo = (args: QuickCreateProps) => {
  const web3Utils = useWeb3Utils()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  return (
    <div>
      <LocalizationWrapper>
        <QuickCreate
          {...args}
          tournamentName={'3PG Axie Tournament'}
          network={network}
          fundraisingLimit={web3Utils.toBN(web3Utils.toWei('1', 'ether'))}
          fundraisingTarget={web3Utils.toBN(web3Utils.toWei('1', 'ether'))}
        />
      </LocalizationWrapper>
      <button onClick={() => setCreateModalOpen(true)}>Open Modal</button>
      <Modal
        isOpen={createModalOpen}
        onAfterOpen={() => console.log('onAfterOpen')}
        onRequestClose={() => setCreateModalOpen(false)}
        style={customStyles}
        contentLabel="Create Lootbox Modal"
      >
        <h2>Hello</h2>
        <button onClick={() => setCreateModalOpen(false)}>close</button>
        <div>I am a modal</div>
      </Modal>
    </div>
  )
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
}

export const Basic = Demo.bind({})
Basic.args = {}
