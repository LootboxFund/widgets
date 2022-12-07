import { FunctionComponent } from 'react'
import './index.css'

const BeforeAirdropClaimQuestions: FunctionComponent = () => {
  return (
    <div className="beforeairdropclaim-questions-div">
      <div className="prize-showcase-div">
        <img className="lootbox-image-icon1" alt="" src="https:///www.lootbox-image1@2x.png" />
        <div className="showcase-text-div">
          <h1 className="title-h1">FREE ANGKAS RIDE</h1>
          <div className="subtitle-div">Limit 1 Per Guest</div>
        </div>
      </div>
      <div className="congrats-div">
        <h2 className="congrats-heading-h2">Congratulations!</h2>
        <div className="receival-subheading-div">You received a FREE gift from a sponsor “Company Name”.</div>
      </div>
      <div className="sponsor-wants-div">
        <div className="callout-div">
          <i className="sponsor-wants-heading">The Sponsor wants you to...</i>
          <i className="sponsor-wants-subheading">Download and try our Mobile Game</i>
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
        <iframe
          className="step-1-video"
          src="https://www.youtube.com/embed/66eIaFIOq9I?rel=0"
          frameBorder="0"
          allowFullScreen
        />
        <button className="action-button">
          <b className="action-button-text">DOWNLOAD GAME</b>
        </button>
      </div>
      <div className="step-two-section">
        <h3 className="step-2-heading">Step 2</h3>
        <div className="step-2-subheading">Answer the two questions here for the advertiser.</div>
        <div className="questionset-div">
          <i className="question">What is the email you used to register?</i>
          <input className="answer-input" type="text" />
        </div>
        <div className="questionset-div">
          <i className="question">What is the email you used to register?</i>
          <input className="answer-input" type="text" />
        </div>
        <button className="action-button">
          <b className="action-button-text">REDEEM PRIZE</b>
        </button>
      </div>
    </div>
  )
}

export default BeforeAirdropClaimQuestions
