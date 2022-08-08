export interface ViralOnboardingUrlParams {
  referralSlug: string | null
}

export const extractURLState_ViralOnboardingPage = () => {
  const url = new URL(window.location.href)
  const params: ViralOnboardingUrlParams = {
    referralSlug: url.searchParams.get('r'),
  }

  return { INITIAL_URL_PARAMS: params }
}
