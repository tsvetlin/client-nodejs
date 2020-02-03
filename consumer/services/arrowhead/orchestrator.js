/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 30.
 */

import networkService from '../network/networkService'
import { config } from '../../config/config'

export function echo() {
  return new Promise((resolve, reject) => {
    networkService.get(config.orchestratorURL + '/echo')
      .then(response => {
        return resolve(response.data)
      })
      .catch(error => {
        return reject(error.response.data.errorMessage)
      })
  })
}

export function orchestration() {

  const payload = {
    requesterSystem: {
      systemName: config.consumerSystemName,
      address: config.consumerAddress,
      port: Number(config.consumerPort),
      authenticationInfo: config.consumerPublicKey
    },
    requestedService: {
      serviceDefinitionRequirement: "Temperature",
      interfaceRequirements: [
        "HTTP-SECURE-JSON"
      ],
      securityRequirements: [
        "CERTIFICATE"
      ]
    },
    orchestrationFlags: {
      overrideStore: true
    }
  }

  return new Promise((resolve, reject) => {
    networkService.post(config.orchestratorURL + '/orchestration', payload)
      .then(response =>{
        return resolve(response.data)
      })
      .catch(error => {
        return reject(error.response.data.errorMessage)
      })
  })
}
