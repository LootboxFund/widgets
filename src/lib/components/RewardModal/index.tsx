import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Horizontal } from '../Generics'
import { Deposit } from 'lib/hooks/useLootbox/utils'
import { $Vertical } from 'lib/components/Generics'
import $Button from '../Generics/Button'
import { COLORS, TicketID } from '@wormgraph/helpers'
import { useLazyQuery } from '@apollo/client'
import { GET_VOUCHER_DEPOSIT_FOR_FAN } from './api.gql'
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
  ticketID: TicketID
}
const RewardModal = (props: RewardModalProps) => {
  const { screen } = useWindowSize()
  const [voucher, setVoucher] = useState<VoucherDeposit>()
  const [getVoucherOfDepositForFan] = useLazyQuery<
    { getVoucherOfDepositForFan: ResponseError | GetVoucherOfDepositForFanResponse },
    QueryGetVoucherOfDepositForFanArgs
  >(GET_VOUCHER_DEPOSIT_FOR_FAN)
  useEffect(() => {
    getVoucher()
  }, [props.currentDeposit, props.ticketID])
  const getVoucher = async () => {
    const depositID = props.currentDeposit.voucherMetadata?.id
    if (depositID) {
      const { data } = await getVoucherOfDepositForFan({
        variables: { payload: { depositID, ticketID: props.ticketID } },
      })
      console.log(`quick data, `, data)
      if (data?.getVoucherOfDepositForFan.__typename === 'GetVoucherOfDepositForFanResponseSuccess') {
        const { getVoucherOfDepositForFan } = data
        const voucher = getVoucherOfDepositForFan.voucher
        console.log(`voucher, `, voucher)
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
            <p
              style={{ fontSize: '1rem', color: COLORS.surpressedFontColor }}
            >{`You won ${props.currentDeposit.title}`}</p>
            <$Horizontal verticalCenter style={{ color: COLORS.surpressedFontColor }}>
              <b style={{ cursor: 'pointer' }}>{`< `}</b>
              <span style={{ margin: '0px 5px' }}>{` 1/3 `}</span>
              <b style={{ cursor: 'pointer' }}>{` >`}</b>
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
          >{`${props.currentDeposit.title}`}</$Horizontal>
        </$Vertical>
        <$Horizontal style={{ width: '100%', flexDirection: screen === 'mobile' ? 'column' : 'row' }}>
          <$Button
            color={COLORS.white}
            backgroundColor={COLORS.trustBackground}
            screen={screen}
            style={{ flex: 1, padding: '20px 0px' }}
          >
            Open Link
          </$Button>
          <div style={{ width: '20px' }}></div>
          <$Button
            color={COLORS.surpressedBackground}
            backgroundColor={COLORS.white}
            screen={screen}
            style={{ flex: 1, fontWeight: 'normal', padding: '20px 0px' }}
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
