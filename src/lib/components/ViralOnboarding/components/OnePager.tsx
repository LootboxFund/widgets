import useWords from 'lib/hooks/useWords'
import { $Horizontal } from 'lib/components/Generics'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Address, COLORS, LootboxID, LootboxType, TYPOGRAPHY } from '@wormgraph/helpers'
import { TEMPLATE_LOOTBOX_STAMP, TermsOfService } from 'lib/hooks/constants'
import { useMutation } from '@apollo/client'
import { CreateClaimResponseFE, CREATE_CLAIM } from '../api.gql'
import {
  LootboxStatus,
  LootboxTournamentStatus,
  MutationCreateClaimArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import './OnePager.css'
import { checkIfValidEmail, detectMobileAddressBarSettings } from 'lib/api/helpers'
import { TournamentPrivacyScope } from '../../../api/graphql/generated/types'
import styled from 'styled-components'
import { useAuth } from 'lib/hooks/useAuth'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import { auth } from 'lib/api/firebase/app'

const PAGE_SIZE = 3

const $SoldOut = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.white};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  text-transform: uppercase;
  z-index: 11;
`

interface Props {
  onNext: (lootboxID: LootboxID, email: string) => Promise<void>
  onBack: () => void
}
const OnePager = (props: Props) => {
  const intl = useIntl()
  const words = useWords()
  const { user, logout, signInAnonymously } = useAuth()
  const [page, setPage] = useState(0)
  const emailInputRef = useRef(null)
  const [searchString, setSearchString] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const { setEmail, chosenLootbox, setChosenLootbox, referral, setClaim, sessionId } = useViralOnboarding()
  const termsOfService = referral.tournament?.privacyScope || []
  const [email, setEmailLocal] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    startFlight()
  }, [])
  useEffect(() => {
    if (!email) {
      if (emailForSignup) {
        setEmailLocal(emailForSignup)
      }
      if (user?.email) {
        setEmailLocal(user.email)
      }
    }
  }, [user?.email, emailForSignup])
  const [createClaim, { loading: loadingClaim }] = useMutation<
    { createClaim: CreateClaimResponseFE | ResponseError },
    MutationCreateClaimArgs
  >(CREATE_CLAIM)

  // const lootboxOptions = useMemo(() => {
  //   return data?.listAvailableLootboxesForClaim?.__typename === 'ListAvailableLootboxesForClaimResponseSuccess'
  //     ? data.listAvailableLootboxesForClaim.lootboxOptions
  //     : null
  // }, [data])

  // const termsOfService = useMemo(() => {
  //   return data?.listAvailableLootboxesForClaim?.__typename === 'ListAvailableLootboxesForClaimResponseSuccess'
  //     ? data.listAvailableLootboxesForClaim.termsOfService
  //     : []
  // }, [data])

  // // @ts-ignore
  // const [tickets, hasNextPage] = useMemo<[LootboxReferralSnapshot[], boolean]>(() => {
  //   if (!lootboxOptions) {
  //     return [[], false]
  //   }
  //   const ticketOptions = lootboxOptions.slice()
  //   ticketOptions
  //     .sort((a, b) => {
  //       if (referral?.seedLootboxID && a.lootboxID === referral.seedLootboxID) {
  //         // Bring to begining of array
  //         return -1
  //       }

  //       if (a.lootbox?.status === LootboxStatus.SoldOut) {
  //         return 1
  //       }

  //       const isDisabled =
  //         b?.lootbox?.status && [LootboxStatus.SoldOut, LootboxStatus.Disabled].indexOf(b.lootbox.status) > -1
  //       if (isDisabled) {
  //         return -1
  //       }

  //       return 0
  //     })
  //     // @ts-ignore
  //     .filter((t) => t.status !== LootboxTournamentStatus.Disabled && t.status !== LootboxStatus.Disabled)

  //   if (!chosenLootbox && ticketOptions[0] && ticketOptions[0].lootbox) {
  //     setChosenLootbox({
  //       nftBountyValue: ticketOptions[0].lootbox.nftBountyValue || undefined,
  //       address: (ticketOptions[0].address as Address) || null,
  //       id: ticketOptions[0].lootbox.id as LootboxID,
  //       stampImage: ticketOptions[0].stampImage,
  //     })
  //   }

  //   if (searchString.length > 0) {
  //     const paginated = ticketOptions.filter((t) => {
  //       return t?.lootbox?.name ? t.lootbox.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 : false
  //     })

  //     return [paginated, false]
  //   } else {
  //     const paginated = ticketOptions.slice(0, PAGE_SIZE * (page + 1))

  //     return [paginated, paginated.length < ticketOptions.length]
  //   }
  // }, [page, lootboxOptions, referral?.seedLootboxID, searchString, chosenLootbox])

  const [tickets, eligibleTickets, hasNextPage, showSearch] = useMemo(() => {
    let onlyShowSeedLootbox = false

    if (referral.seedLootboxID) {
      const seedLootbox = referral.tournament?.lootboxSnapshots?.find((l) => l.lootbox.id === referral.seedLootboxID)
      if (seedLootbox) {
        onlyShowSeedLootbox = seedLootbox?.lootbox?.safetyFeatures?.isExclusiveLootbox || false
      }
    }

    const _tickets = referral.tournament?.lootboxSnapshots?.slice() || []

    _tickets.sort((a, b) => {
      if (referral?.seedLootboxID && a.lootbox.id === referral.seedLootboxID) {
        // Bring to begining of array
        return -1
      }

      if (a.lootbox?.status === LootboxStatus.SoldOut) {
        return 1
      }

      const isDisabled =
        (b?.lootbox?.status && [LootboxStatus.SoldOut, LootboxStatus.Disabled].indexOf(b.lootbox.status) > -1) ||
        (b?.status && [LootboxTournamentStatus.Disabled].indexOf(b.status) > -1)

      if (isDisabled) {
        return -1
      }

      return 0
    })

    const eligibleTickets = _tickets.filter((t) => {
      if (t.lootbox.type === LootboxType.Airdrop) {
        // dont show airdrops
        return false
      }
      if (onlyShowSeedLootbox) {
        return t.lootbox.id === referral.seedLootboxID
      }
      return (
        !t.lootbox.safetyFeatures?.isExclusiveLootbox && // removes exclusive lootboxes
        t.status !== LootboxTournamentStatus.Disabled && // removes disabled lootboxes
        t.lootbox.status !== LootboxStatus.Disabled // removes disabled lootboxes
      )
    })

    if (searchString.length > 0) {
      const filteredTickets = eligibleTickets.filter((t) => {
        return t?.lootbox?.name ? t.lootbox.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 : false
      })

      return [filteredTickets, eligibleTickets, false, true]
    } else {
      const filteredTickets = eligibleTickets.slice(0, PAGE_SIZE * (page + 1))
      return [
        filteredTickets,
        eligibleTickets,
        filteredTickets.length < eligibleTickets.length,
        eligibleTickets.length > PAGE_SIZE,
      ]
    }
  }, [page, referral, searchString])

  useEffect(() => {
    if (!chosenLootbox && eligibleTickets.length > 0) {
      const initLootbox = eligibleTickets[0]
      setChosenLootbox({
        nftBountyValue: initLootbox.lootbox.nftBountyValue || undefined,
        address: (initLootbox?.lootbox.address as Address) || null,
        id: initLootbox.lootbox.id as LootboxID,
        stampImage: initLootbox.lootbox.stampImage || TEMPLATE_LOOTBOX_STAMP,
      })
    }
  }, [eligibleTickets, chosenLootbox, setChosenLootbox])

  const startFlight = async () => {
    try {
      if (!referral?.slug) {
        console.error('No referral slug')
        throw new Error(words.anErrorOccured)
      }
      const { data } = await createClaim({
        variables: {
          payload: {
            referralSlug: referral?.slug,
          },
        },
      })

      if (
        !data?.createClaim ||
        data?.createClaim?.__typename === 'ResponseError' ||
        data?.createClaim?.__typename !== 'CreateClaimResponseSuccess'
      ) {
        throw new Error(words.anErrorOccured)
      }

      const claim = (data.createClaim as CreateClaimResponseFE).claim

      setClaim(claim)
    } catch (err) {
      console.error(err)
      setErrorMessage(err?.message || words.anErrorOccured)
    }
  }

  const submitForm = async () => {
    setLoading(true)
    setAgreeTerms(true)

    if (!chosenLootbox) {
      setErrorMessage('Please choose a Lootbox')
      setLoading(false)
      return
    }
    if (!email) {
      setErrorMessage('Please enter your email')
      if (emailInputRef.current) {
        // @ts-ignore
        emailInputRef.current.focus()
      }
      setLoading(false)
      return
    }

    // just ad it to memory
    // it will be added to user object in next page
    const isValid = checkIfValidEmail(email)
    if (!isValid) {
      setErrorMessage('Please enter a valid email')
      if (emailInputRef.current) {
        // @ts-ignore
        emailInputRef.current.focus()
      }
      setLoading(false)
      return
    }
    // @ts-ignore
    emailInputRef.current.blur()
    setErrorMessage('')

    const stateVsLocalStorageEmailDiffers = emailForSignup && email !== emailForSignup
    const stateVsUserAuthEmailDiffers = user?.email && email !== user?.email

    // handle new user request by logging out of existing and into new anon
    if (stateVsUserAuthEmailDiffers || stateVsLocalStorageEmailDiffers) {
      await logout()
      auth.onAuthStateChanged(async (user) => {
        if (user === null) {
          setEmailForSignup(email)
          setEmail(email)
          try {
            // Sign user in anonymously and send magic link
            await props.onNext(chosenLootbox.id, email)
          } catch (err) {
            setErrorMessage(err?.message || words.anErrorOccured)
          } finally {
            setLoading(false)
          }
        }
      })
    } else {
      setEmailForSignup(email)
      setEmail(email)
      try {
        // Sign user in anonymously and send magic link
        await props.onNext(chosenLootbox.id, email)
      } catch (err) {
        setErrorMessage(err?.message || words.anErrorOccured)
      } finally {
        setLoading(false)
      }
    }
  }

  const determineToS = () => {
    if (
      termsOfService.includes(TournamentPrivacyScope.DataSharing) &&
      termsOfService.includes(TournamentPrivacyScope.MarketingEmails)
    ) {
      return (
        <span className="terms-and-conditions-fine-prin">
          <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
            I accept the
          </span>
          <span className="span">{` `}</span>
          <a className="terms-and-conditions" href={TermsOfService.dataSharingAndMarketingEmails} target="_blank">
            terms and conditions
          </a>
          <span className="span">{` `}</span>
          <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
            with potential marketing emails and data sharing with 3rd parties
          </span>
        </span>
      )
    } else if (termsOfService.includes(TournamentPrivacyScope.DataSharing)) {
      return (
        <span className="terms-and-conditions-fine-prin">
          <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
            I accept the
          </span>
          <span className="span">{` `}</span>
          <a className="terms-and-conditions" href={TermsOfService.dataSharingOnly} target="_blank">
            terms and conditions
          </a>
          <span className="span">{` `}</span>
          <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
            with potential data sharing with 3rd parties
          </span>
        </span>
      )
    } else if (termsOfService.includes(TournamentPrivacyScope.MarketingEmails)) {
      return (
        <span className="terms-and-conditions-fine-prin">
          <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
            I accept the
          </span>
          <span className="span">{` `}</span>
          <a className="terms-and-conditions" href={TermsOfService.marketingEmailsOnly} target="_blank">
            terms and conditions
          </a>
          <span className="span">{` `}</span>
          <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
            with potential marketing emails
          </span>
        </span>
      )
    }
    return (
      <span className="terms-and-conditions-fine-prin">
        <span className="i-accept-the" onClick={() => setAgreeTerms(!agreeTerms)}>
          I accept the
        </span>
        <span className="span">{` `}</span>
        <a className="terms-and-conditions" href={TermsOfService.vanilla} target="_blank">
          terms and conditions
        </a>
      </span>
    )
  }

  const { userAgent, addressBarlocation, addressBarHeight } = detectMobileAddressBarSettings()
  return (
    <div className="invite-loop-wrapper">
      <div
        className="viral-invite-loop-intro-slid"
        style={{
          // @ts-ignore
          maxHeight: screen.availHeight - addressBarHeight,
          height: screen.availHeight - addressBarHeight,
        }}
      >
        <div className="powered-by-banner" id="fan-rewards-banner">
          <div className="powered-by-banner-text">
            <span>Fan Rewards Powered by</span>
            <b>{` 🎁 `}</b>
            <span className="lootbox-span">LOOTBOX</span>
          </div>
        </div>
        <div className="main-layout-div" style={{ padding: '0px 10px' }}>
          <div className="cover-info-div">
            <div className="host-logo-image">
              <img
                className="host-logo-icon"
                alt="event organizer logo"
                src="https://firebasestorage.googleapis.com/v0/b/lootbox-fund-staging.appspot.com/o/shared-company-assets%2Flogo.jpeg?alt=media"
              />
            </div>
            <div className="main-info-text">
              <b className="main-heading-b">{`Win ${
                referral.tournament.lootboxSnapshots[0]?.lootbox?.nftBountyValue || 'Cash Prize'
              }`}</b>
              <i className="social-proof-oneliner">{`${
                referral?.tournament?.runningCompletedClaims || 0
              } people already accepted`}</i>
            </div>
          </div>
          <div className="email-input-div">
            <div className="frame-div">
              {errorMessage ? <span className="error-message">{errorMessage}</span> : null}
              <div className="input-wrapper">
                <input
                  className={`email-field-input ${email.length === 0 && ' glowing-action'}`}
                  id="email-input-mandatory"
                  type="email"
                  ref={emailInputRef}
                  placeholder="enter your email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmailLocal(e.target.value)
                  }}
                  onKeyUp={(event) => {
                    if (event.key == 'Enter') {
                      submitForm()
                    }
                  }}
                />
                <button id="submit-arrow-button" onClick={submitForm} disabled={loading}>
                  {loading || loadingClaim ? (
                    <div className="submit-loading-icon"></div>
                  ) : (
                    <span className="submit-arrow-icon">{`▶`}</span>
                  )}
                </button>
              </div>
            </div>
            <div className="frame-div1">
              <div className="terms-and-conditions-checkbox">
                <input
                  className="terms-and-conditions-input-che"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                {determineToS()}
              </div>
            </div>
          </div>
          <div className="lootbox-selection-list">
            <div className="faq-primer-div">
              <div className="primer-heading-div">How will I know if I won?</div>
              <div className="primer-subheading-div">
                <p className="you-will-receive">
                  You will receive an email after the event if your chosen team wins the competition. Scroll down for
                  more.
                </p>
              </div>
            </div>
            <div className="lootbox-options-list">
              {showSearch && (
                <input
                  className="team-search-input"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  placeholder="Search by team name"
                />
              )}
              {tickets.map((ticket, idx) => {
                const description = !ticket?.lootbox?.description
                  ? ''
                  : ticket.lootbox.description.length > 80
                  ? ticket.lootbox.description.slice(0, 80) + '...'
                  : ticket?.lootbox?.description
                const isChosen = chosenLootbox && chosenLootbox?.id === ticket.lootbox.id

                const isDisabled =
                  ticket?.lootbox?.status &&
                  [LootboxStatus.SoldOut, LootboxStatus.Disabled].indexOf(ticket.lootbox.status) > -1
                if (ticket?.lootbox?.status === LootboxStatus.Disabled) return null
                return (
                  <article
                    key={ticket.lootbox.id}
                    className="lootbox-option-article"
                    style={{
                      boxShadow: isChosen && email.length !== 0 ? '0px 4px 15px #4baff5' : '',
                      cursor: !isDisabled ? 'pointer' : 'not-allowed',
                      position: 'relative',
                    }}
                    onClick={() => {
                      if (!isDisabled && !loading) {
                        setChosenLootbox({
                          nftBountyValue: ticket.lootbox.nftBountyValue,
                          address: ticket.lootbox.address || null,
                          id: ticket.lootbox.id,
                          stampImage: ticket.lootbox.stampImage || TEMPLATE_LOOTBOX_STAMP,
                        })
                      }
                    }}
                  >
                    <img
                      className="lootbox-preview-image"
                      alt=""
                      src={
                        ticket?.lootbox?.stampImage
                          ? convertFilenameToThumbnail(ticket.lootbox.stampImage, 'sm')
                          : TEMPLATE_LOOTBOX_STAMP
                      }
                    />
                    <div className="lootbox-option-info">
                      <$Horizontal justifyContent="space-between" style={{ height: '15px', width: '100%' }}>
                        <div className="lootbox-prize-value">{`${words.win} ${ticket?.lootbox?.nftBountyValue}`}</div>
                        {isChosen ? (
                          <div
                            className="lootbox-selected"
                            style={{
                              backgroundColor: email.length === 0 ? '#e9e9e9' : '#4baff5',
                            }}
                          >
                            Selected
                          </div>
                        ) : (
                          <div className="lootbox-not-selected"></div>
                        )}
                      </$Horizontal>

                      <div className="lootbox-name-div">{ticket?.lootbox?.name}</div>
                      <div className="lootbox-description-div">{description}</div>
                    </div>
                    {ticket.lootbox.status === LootboxStatus.SoldOut && (
                      <$SoldOut>{`📦 ${words.outOfStock} 📦`}</$SoldOut>
                    )}
                  </article>
                )
              })}

              {hasNextPage && (
                <button onClick={() => setPage(page + 1)} className="see-more-button">
                  {words.seeMore}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="action-button-div" style={{ padding: '10px' }}>
          <button disabled={loading} onClick={submitForm} className="email-submit-button">
            {loading || loadingClaim ? (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/lootbox-fund-staging.appspot.com/o/shared-company-assets%2Floading-gif.gif?alt=media"
                height="30px"
                width="auto"
              />
            ) : (
              <b className="email-submit-button-text">FINISH</b>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnePager
