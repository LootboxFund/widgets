export interface ViralOnboardingUrlParams {
  referralSlug: string | null
  claimID: string | null
  lootboxID: string | null
}

export const extractURLState_ViralOnboardingPage = () => {
  const url = new URL(window.location.href)
  const params: ViralOnboardingUrlParams = {
    referralSlug: url.searchParams.get('r'),
    claimID: url.searchParams.get('c'),
    lootboxID: url.searchParams.get('l'),
  }

  return { INITIAL_URL_PARAMS: params }
}
