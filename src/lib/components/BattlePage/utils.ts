export interface BattlePageUrlParams {
  stream: string | null
  tournament: string | null
}

export const extractURLState_BattlePage = () => {
  const url = new URL(window.location.href)
  const params: BattlePageUrlParams = {
    stream: url.searchParams.get('stream'),
    tournament: url.searchParams.get('tournament') || url.searchParams.get('tid'),
  }

  return { INITIAL_URL_PARAMS: params }
}
