import Header from 'lib/components/Header'
// import { Trans } from '@lingui/macro'
import useActiveWeb3React from 'lib/hooks/useActiveWeb3React'
import Wallet from 'components/Wallet'

export interface CrowdSaleProps {

}
const CrowdSale = () => {
	const { active, account } = useActiveWeb3React()
	console.log(`active: `, active)
	console.log(`account: `, account)
	return (
		<>
			<Header logo title={<p>Swap</p>}>
				<Wallet disabled={!account} />
			</Header>
		</>
	)
	// return (
	// 	<>
	// 	  <Header logo title={<Trans>Swap</Trans>}>
	// 		{active && <Wallet disabled={!account} />}
	// 	  </Header>
	// 	</>
	//   )
}

export default CrowdSale