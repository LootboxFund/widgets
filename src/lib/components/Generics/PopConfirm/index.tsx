import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import LogRocket from 'logrocket'
import { useState } from 'react'
import styled from 'styled-components'
import { $Horizontal } from '..'
import { $span } from '../Typography'

interface PopConfirmProps {
  onOk: () => Promise<void>
  children: React.ReactNode
  [key: string]: any
}
export const PopConfirm = ({ children, onOk, ...rest }: PopConfirmProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const handleOk = async () => {
    setLoading(true)
    try {
      await onOk()
      setIsVisible(false)
    } catch (err) {
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const ConfirmModal = () => {
    return (
      <$ConfirmModalContainer>
        <$span bold>Are you sure?</$span>
        <br />
        <$Horizontal spacing={2}>
          <$NoButton>No</$NoButton>
          <$YesButton disabled={loading} onClick={handleOk}>
            Yes
          </$YesButton>
        </$Horizontal>
      </$ConfirmModalContainer>
    )
  }
  return (
    <$ConfirmContainer onClick={toggleVisibility} {...rest}>
      {isVisible && <ConfirmModal />}
      {children}
    </$ConfirmContainer>
  )
}

const $ConfirmContainer = styled.div`
  position: relative;
  display: inline-block;
`

const $ConfirmModalContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 25px;
  background-color: #ffffff;
  border-radius: 10px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  color: #fff;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
`

const $NoButton = styled.button`
  background-color: ${COLORS.surpressedBackground}51;
  color: ${COLORS.surpressedFontColor};
  border: none;
  border-radius: 4px;
  padding: 0px 10px;
  width: 80px;
  height: 30px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  width: 100%;
  cursor: pointer;
  text-align: center;
`

const $YesButton = styled.button`
  background-color: ${COLORS.dangerBackground};
  color: ${COLORS.dangerFontColor};
  border: none;
  border-radius: 4px;
  padding: 0px 10px;
  width: 80px;
  height: 30px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  width: 100%;
  cursor: pointer;
  text-align: center;
`

const $Button = styled.button``

export default PopConfirm
