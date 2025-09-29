import type {RequestHandler} from './$types'

export const GET: RequestHandler = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000))

  return await fetch('http://localhost:3000/rpc/get_all_latest_cumsum_metrics')
}