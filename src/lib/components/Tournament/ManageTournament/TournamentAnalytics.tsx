import { useMutation } from '@apollo/client'
import { COLORS, TYPOGRAPHY, TournamentID } from '@wormgraph/helpers'
import { ResponseError, GenerateClaimsCsvPayload } from 'lib/api/graphql/generated/types'
import { $ErrorMessage, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { $Link } from 'lib/components/Profile/common'
import useWindowSize from 'lib/hooks/useScreenSize'
import useWords from 'lib/hooks/useWords'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { GET_CLAIMS_CSV, GenerateClaimsCsvFE } from './api.gql'

interface TournamentAnalyticsProps {
  tournamentId: TournamentID
}
const TournamentAnalytics = (props: TournamentAnalyticsProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const [files, setFiles] = useState<string[]>([])
  const [getClaimsCsv, { loading: getClaimsCsvLoading, error, data }] = useMutation<
    { generateClaimsCsv: GenerateClaimsCsvFE | ResponseError },
    { payload: GenerateClaimsCsvPayload }
  >(GET_CLAIMS_CSV, {
    onCompleted: (data) => {
      if (data.generateClaimsCsv.__typename === 'GenerateClaimsCsvResponseSuccess') {
        setFiles([data.generateClaimsCsv.csv, ...files])
      }
    },
  })
  const downloadCsvText = intl.formatMessage({
    id: 'tournamentAnalytics.button.downloadCSV',
    defaultMessage: 'Generate CSV',
  })

  return (
    <$Vertical spacing={4}>
      {files.map((file, idx) => (
        <$span>
          👉{' '}
          <$Link href={file} key={`download-${idx}`} download style={{ fontStyle: 'italic' }}>
            {words.downloadCSVFile}
          </$Link>
        </$span>
      ))}
      <div>
        <$Button
          screen={screen}
          color={COLORS.trustFontColor}
          backgroundColor={`${COLORS.trustBackground}`}
          onClick={() => {
            getClaimsCsv({
              variables: {
                payload: {
                  tournamentId: props.tournamentId,
                },
              },
            })
          }}
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.regular,
            fontSize: TYPOGRAPHY.fontSize.large,
          }}
        >
          <LoadingText text={downloadCsvText} loading={getClaimsCsvLoading} color={COLORS.white} />
        </$Button>
      </div>
      {(error || data?.generateClaimsCsv.__typename === 'ResponseError') && (
        <$ErrorMessage>{error?.message || words.anErrorOccured}</$ErrorMessage>
      )}
    </$Vertical>
  )
}

export default TournamentAnalytics
