import { useAuth } from 'lib/hooks/useAuth'
import Spinner from '../Generics/Spinner'
import { COLORS, LootboxID } from '@wormgraph/helpers'
import { PropsWithChildren, useMemo } from 'react'
import {
  GetLootboxRedeemPageResponseFE,
  GetLootboxRedeemPageResponseFESuccess,
  GET_LOOTBOX_REDEEM_PAGE,
  LootboxRedemptionFE,
} from './api.gql'
import { $RedeemCosmicContainer, $RedeemCosmicSubtitle, $StampImg } from '.'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Horizontal, $Vertical } from '../Generics'
import { truncateAddress } from 'lib/api/helpers'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import useWords from 'lib/hooks/useWords'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { useQuery } from '@apollo/client'
import { QueryGetLootboxByIdArgs } from 'lib/api/graphql/generated/types'
import { Oopsies } from 'lib/components/Profile/common'
import Authentication from 'lib/components/Authentication'

type AuthGuardProps = PropsWithChildren<{ lootboxID: LootboxID } & any>

const CosmicAuthGuard = ({ lootboxID, children, ...props }: AuthGuardProps): JSX.Element => {
  const { user } = useAuth()
  const { screen } = useWindowSize()
  const words = useWords()
  //   const [showAllDeposits, setShowAllDeposits] = useState(false)
  const {
    data: dataLootbox,
    loading: loadingLootboxQuery,
    error,
  } = useQuery<GetLootboxRedeemPageResponseFE, QueryGetLootboxByIdArgs>(GET_LOOTBOX_REDEEM_PAGE, {
    variables: { id: lootboxID },
  })
  const { lootboxData }: { lootboxData: LootboxRedemptionFE | null } = useMemo(() => {
    const lootboxData = (dataLootbox?.getLootboxByID as GetLootboxRedeemPageResponseFESuccess)?.lootbox || null
    return { lootboxData }
  }, [dataLootbox?.getLootboxByID])

  //   const { deposits: allDeposits } = useLootbox({
  //     lootboxAddress: lootboxData?.address,
  //     chainIDHex: lootboxData?.chainIdHex,
  //   })

  //   const truncatedDeposits = showAllDeposits ? allDeposits.slice() : allDeposits.slice(0, 4)

  //   const renderAllDeposits = () => {
  //     if (allDeposits.length === 0) {
  //       return null
  //     }
  //     return (
  //       <$Vertical spacing={2}>
  //         <$RedeemCosmicSubtitle style={{ fontStyle: 'italic' }}>All Lootbox Deposits</$RedeemCosmicSubtitle>
  //         {truncatedDeposits.map((deposit, idx) => {
  //           return (
  //             <$DividendRow key="all-deposits" isActive={!deposit.isRedeemed}>
  //               <$DividendOwed>
  //                 {`${deposit.isRedeemed ? '☑️ ' : ''}${parseEth(deposit.tokenAmount, Number(deposit.decimal))}`}
  //               </$DividendOwed>
  //               <$DividendTokenSymbol>{deposit.tokenSymbol}</$DividendTokenSymbol>
  //             </$DividendRow>
  //           )
  //         })}
  //         {showAllDeposits && truncatedDeposits.length >= allDeposits.length ? (
  //           <div>
  //             <$RedeemCosmicButton onClick={() => setShowAllDeposits(false)} theme="link">
  //               {words.hide}
  //             </$RedeemCosmicButton>
  //           </div>
  //         ) : !showAllDeposits && truncatedDeposits.length < allDeposits.length ? (
  //           <div>
  //             <$RedeemCosmicButton onClick={() => setShowAllDeposits(true)} theme="link">
  //               {words.seeMore}
  //             </$RedeemCosmicButton>
  //           </div>
  //         ) : null}
  //       </$Vertical>
  //     )
  //   }

  if (loadingLootboxQuery) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || dataLootbox?.getLootboxByID.__typename === 'ResponseError') {
    const isNotFound =
      dataLootbox?.getLootboxByID.__typename === 'ResponseError'
        ? dataLootbox?.getLootboxByID.error.code === 'NotFound'
        : false
    if (isNotFound) {
      return <Oopsies icon="🧐" title={words.notFound} />
    }
    return (
      <Oopsies
        icon="🤕"
        title={words.anErrorOccured}
        // @ts-ignore
        message={error?.message || lootboxData?.getLootboxByID?.error?.message || words.notFound}
      />
    )
  } else if (!lootboxData) {
    return <Oopsies icon="🧐" title={words.notFound} />
  }

  const lootboxImage = convertFilenameToThumbnail(lootboxData.stampImage, 'md')

  if (user === undefined) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (!user) {
    return (
      <$RedeemCosmicContainer screen={screen} themeColor={lootboxData.themeColor} style={{ margin: '0 auto' }}>
        <$Horizontal spacing={4} style={screen === 'mobile' ? { flexDirection: 'column-reverse' } : undefined}>
          <$Vertical spacing={2}>
            <$StampImg src={lootboxImage} alt={lootboxData.name} />
            <$RedeemCosmicSubtitle style={{ color: `${COLORS.surpressedFontColor}AE` }}>
              {truncateAddress(lootboxData.address, { prefixLength: 10, suffixLength: 8 })}{' '}
              <CopyIcon text={lootboxData.address} smallWidth={18} />
            </$RedeemCosmicSubtitle>
          </$Vertical>

          <$Vertical spacing={2}>
            {/* <$RedeemCosmicTitle screen={screen}>{lootboxData.name}</$RedeemCosmicTitle> */}
            {/* <br /> */}
            <Authentication
              initialMode="login-phone"
              loginTitle={`Login to Redeem "${lootboxData.name}" Tickets`}
              width="100%"
              ghost
            />
            <br />
            {/* {!allDeposits || allDeposits.length === 0 ? (
              <$Vertical style={{ paddingTop: '20px' }}>
                <$EarningsContainer>
                  <$EarningsText> No rewards have been deposited yet</$EarningsText>
                </$EarningsContainer>
              </$Vertical>
            ) : (
              renderAllDeposits()
            )} */}
          </$Vertical>
        </$Horizontal>
      </$RedeemCosmicContainer>
    )
  } else {
    return children
  }
}

export default CosmicAuthGuard
