export interface PublicProfileUrlParams {
  userId: string | null
}

export const extractURLState_PublicProfilePage = () => {
  const url = new URL(window.location.href)
  const params: PublicProfileUrlParams = {
    userId: url.searchParams.get('uid'),
  }

  return { INITIAL_URL_PARAMS: params }
}
