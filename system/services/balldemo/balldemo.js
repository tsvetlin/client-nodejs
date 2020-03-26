/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 24.
 */

import { orchestration } from '../arrowhead/orchestrator'
import { serviceRequestFormBalldemo } from '../../utils/systemUtils'
import networkService from '../network/networkService'
import { config } from '../../config/config'
import axios from 'axios'
import { app } from '../../app'

let zinqBerry = {}

export async function getZinqBerry() {
  const orchestrationResponse = await orchestration(serviceRequestFormBalldemo)
  // console.log(JSON.stringify(orchestrationResponse, null, 4))

  const entry = orchestrationResponse && orchestrationResponse.response ? orchestrationResponse.response[0] : {}

  zinqBerry = {
    address: entry.provider.address,
    port: entry.provider.port,
    serviceUri: entry.serviceUri,
    token: entry.authorizationTokens['HTTP-SECURE-JSON']
  }

  // console.log(zinqBerry.token)
}

export async function getBallData (address, port, serviceUri, token) {
  return new Promise(async (resolve, reject) => {
    const zinqBerryAddress = `${config.serverSSLEnabled ? 'https' : 'http'}://${address}:${port}/${serviceUri}`
    let response = null
    const source = axios.CancelToken.source()

    setTimeout(() => {
      if (response === null) {
        source.cancel('getBallData | ZinqBerry is not available...')
      }
    }, 1000)

    response = await networkService.get(zinqBerryAddress, {cancelToken: source.token, params: { token }})
      .then(response => {
        console.log(response.data)
        return resolve(response.data)
      })
      .catch(error => {
        console.log(error)
        return reject(error.response)
      })
  })
}

export async function getBallDataForDashboard() {
  const r = await getBallData(zinqBerry.address, zinqBerry.port, zinqBerry.serviceUri, zinqBerry.token)
  app.io.emit('balldemo', r)
}
