import { CreditCard } from 'lib/icons'
import Row from 'lib/components/Row'
import { ThemedText } from 'lib/theme'

export default function Wallet({ disabled }: { disabled?: boolean }) {
  return disabled ? (
    <ThemedText.Caption color="secondary">
      <Row gap={0.25}>
        <CreditCard />
        Connect wallet to swap
      </Row>
    </ThemedText.Caption>
  ) : null
}
