import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Horizontal } from '../Generics'
import { Deposit } from 'lib/hooks/useLootbox/utils'
import { $Vertical } from 'lib/components/Generics'
import $Button from '../Generics/Button'
import { COLORS, DepositID, LootboxTicketID } from '@wormgraph/helpers'
import { useLazyQuery } from '@apollo/client'
import { GET_VOUCHER_DEPOSIT_FOR_FAN } from './api.gql'
import { ReactNode } from 'react'
import {
  GetVoucherOfDepositForFanResponse,
  QueryGetVoucherOfDepositForFanArgs,
  ResponseError,
  VoucherDeposit,
} from 'lib/api/graphql/generated/types'

export interface RewardModalProps {
  isModalOpen: boolean
  closeModal: () => void
  currentDeposit: Deposit
  allDeposits: Deposit[]
  changeCurrentDeposit: (depositID: DepositID) => void
  ticketID: LootboxTicketID
  renderWeb3Button: () => ReactNode
}
const RewardModal = (props: RewardModalProps) => {
  const { screen } = useWindowSize()
  const [voucher, setVoucher] = useState<VoucherDeposit>()
  const [getVoucherOfDepositForFan] = useLazyQuery<
    { getVoucherOfDepositForFan: ResponseError | GetVoucherOfDepositForFanResponse },
    QueryGetVoucherOfDepositForFanArgs
  >(GET_VOUCHER_DEPOSIT_FOR_FAN)
  useEffect(() => {
    if (props.currentDeposit && props.currentDeposit.voucherMetadata) {
      getVoucher()
    } else {
      setVoucher(undefined)
    }
  }, [props.currentDeposit, props.ticketID])
  const getVoucher = async () => {
    console.log(`props.currentDeposit`, props.currentDeposit)
    const depositID = props.currentDeposit.id
    if (depositID) {
      const { data } = await getVoucherOfDepositForFan({
        variables: { payload: { depositID, ticketID: props.ticketID } },
      })

      if (data?.getVoucherOfDepositForFan.__typename === 'GetVoucherOfDepositForFanResponseSuccess') {
        const { getVoucherOfDepositForFan } = data
        const voucher = getVoucherOfDepositForFan.voucher

        setVoucher(voucher)
      }
    }
  }
  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px',
      inset: screen === 'mobile' ? '10px' : '60px',
      maxWidth: '500px',
      margin: 'auto',
      maxHeight: '800px',
      fontFamily: 'sans-serif',
    },
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 10000,
    },
  }
  function getNextIndex(arr: any[], a: number, x: number) {
    // Get the length of the array
    const len = arr.length

    // Calculate the next index by adding the increment to the current index
    let nextIndex = a + x

    // If the next index is negative, wrap around to the end of the array
    if (nextIndex < 0) {
      nextIndex = len - 1
    }

    // If the next index is greater than or equal to the length of the array, wrap around to the beginning
    if (nextIndex >= len) {
      nextIndex = 0
    }

    // Return the next index
    return nextIndex
  }

  console.log(`currentDeposit`, props.currentDeposit)

  const titleShown = voucher ? voucher.title : props.currentDeposit.title
  const codeShown = voucher ? voucher.code : props.currentDeposit.title
  const linkShown = voucher ? voucher.url : props.currentDeposit.web3Metadata?.tokenAddress
  const currentDepositIndex = props.allDeposits.findIndex((d) => d.id === props.currentDeposit.id)
  return (
    <$RewardModal>
      <Modal
        isOpen={props.isModalOpen}
        onRequestClose={props.closeModal}
        contentLabel={`You won a reward!`}
        style={customStyles}
      >
        <$Horizontal
          justifyContent="flex-end"
          style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span onClick={props.closeModal}>X</span>
        </$Horizontal>
        <$Vertical justifyContent="flex-start" style={{ width: '100%', padding: '10px' }}>
          <$Horizontal justifyContent="space-between">
            <p style={{ fontSize: '1rem', color: COLORS.surpressedFontColor }}>{`You won ${titleShown}`}</p>
            <$Horizontal verticalCenter style={{ color: COLORS.surpressedFontColor }}>
              <b
                onClick={() => {
                  const nthDeposit = getNextIndex(props.allDeposits, currentDepositIndex, -1)
                  const nextDeposit = props.allDeposits[nthDeposit]
                  props.changeCurrentDeposit(nextDeposit.id)
                }}
                style={{ cursor: 'pointer' }}
              >{`< `}</b>
              <span style={{ margin: '0px 5px' }}>{` ${currentDepositIndex + 1}/${props.allDeposits.length} `}</span>
              <b
                onClick={() => {
                  const nthDeposit = getNextIndex(props.allDeposits, currentDepositIndex, 1)
                  const nextDeposit = props.allDeposits[nthDeposit]
                  props.changeCurrentDeposit(nextDeposit.id)
                }}
                style={{ cursor: 'pointer' }}
              >{` >`}</b>
            </$Horizontal>
          </$Horizontal>
          <$Horizontal
            justifyContent="center"
            verticalCenter
            style={{
              backgroundColor: '#ECECEC',
              padding: '40px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: COLORS.surpressedFontColor,
            }}
          >{`${codeShown}`}</$Horizontal>
        </$Vertical>
        <$Horizontal style={{ width: '100%', flexDirection: screen === 'mobile' ? 'column' : 'row' }}>
          {props.currentDeposit?.web3Metadata ? (
            <div style={{ flex: 1 }}>{props.renderWeb3Button()}</div>
          ) : (
            <a href={linkShown || ''} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <$Button
                color={COLORS.white}
                backgroundColor={COLORS.trustBackground}
                screen={screen}
                style={{ padding: '20px 0px', width: '100%' }}
              >
                Open Link
              </$Button>
            </a>
          )}

          <div style={{ width: '20px' }}></div>
          <$Button
            color={COLORS.surpressedBackground}
            backgroundColor={COLORS.white}
            screen={screen}
            style={{ flex: 1, fontWeight: 'normal', padding: '20px 0px' }}
            onClick={() => {
              const nthDeposit = getNextIndex(props.allDeposits, currentDepositIndex, 1)
              const nextDeposit = props.allDeposits[nthDeposit]
              console.log(`nextDeposit `, nextDeposit)
              props.changeCurrentDeposit(nextDeposit.id)
            }}
          >
            Skip & Next
          </$Button>
        </$Horizontal>
        <$Horizontal>
          <i style={{ fontSize: '0.9rem', color: COLORS.surpressedBackground, marginTop: '15px' }}>
            Use the above voucher code or click the link. Or skip to next prize (your prize will remain)
          </i>
        </$Horizontal>
      </Modal>
    </$RewardModal>
  )
}

const $RewardModal = styled.div<{}>``

export default RewardModal
