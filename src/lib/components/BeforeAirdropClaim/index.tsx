import { LootboxAirdropMetadata, LootboxID } from '@wormgraph/helpers'
import { LootboxAirdropMetadataQuestion } from 'lib/api/graphql/generated/types'
import { FunctionComponent } from 'react'
import './index.css'

interface BeforeAirdropClaimQuestionsProps {
  name: string
  nftBountyValue: string
  stampImage: string
  lootboxID: LootboxID
  airdropMetadata: LootboxAirdropMetadata
  airdropQuestions: LootboxAirdropMetadataQuestion[]
}
const BeforeAirdropClaimQuestions = (props: BeforeAirdropClaimQuestionsProps) => {
  const questionsToCollect = props.airdropQuestions.slice().sort((a, b) => (b.order || 99) - (a.order || 99))
  return (
    <div className="beforeairdropclaim-questions-div">
      <div className="prize-showcase-div">
        <img className="lootbox-image-icon1" alt="" src={props.stampImage} />
        <div className="showcase-text-div">
          <h1 className="title-h1">{props.nftBountyValue}</h1>
          <div className="subtitle-div">Airdrop Gift</div>
        </div>
      </div>
      <div className="congrats-div">
        <h2 className="congrats-heading-h2">Congratulations!</h2>
        <div className="receival-subheading-div">
          You received a FREE gift from a sponsor “{props.airdropMetadata.advertiserName || 'Unknown'}”.
        </div>
      </div>
      <div className="sponsor-wants-div">
        <div className="callout-div">
          <i className="sponsor-wants-heading">The Sponsor wants you to...</i>
          <i className="sponsor-wants-subheading">
            {props.airdropMetadata.oneLiner || 'Redeem Gift, no strings attached'}
          </i>
        </div>
      </div>
      <div className="how-to-redeem">
        <h2 className="how-to-redeem-heading">How to Redeem</h2>
      </div>
      <div className="step-one-section">
        <h3 className="step-1-heading">Step 1</h3>
        <div className="step-1-subheading">
          Follow the sponsor’s instructions here. Do this at your own risk. LOOTBOX assumes no responsiblity between you
          and sponsor.
        </div>
        <iframe className="step-1-video" src={props.airdropMetadata.instructionsLink} frameBorder="0" allowFullScreen />
        <a
          id="action-button-text-id"
          href={props.airdropMetadata.callToActionLink}
          target="_blank"
          rel="noreferrer"
          style={{ width: '100%' }}
        >
          <button className="action-button">
            <b className="action-button-text">{props.airdropMetadata.instructionsCallToAction || 'Complete Task'}</b>
          </button>
        </a>
      </div>
      <div className="step-two-section">
        <h3 className="step-2-heading">Step 2</h3>
        <div className="step-2-subheading">Answer the two questions here for the advertiser.</div>
        {questionsToCollect.map((q) => {
          return (
            <div key={q.id} className="questionset-div">
              <i className="question">{q.question}</i>
              <input className="answer-input" type="text" />
            </div>
          )
        })}
        <button className="action-button">
          <b className="action-button-text">REDEEM PRIZE</b>
        </button>
      </div>
    </div>
  )
}

export default BeforeAirdropClaimQuestions
