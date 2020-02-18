/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 30.
 */

import networkService from '../network/networkService'
import axios from 'axios'
import { config } from '../../config/config'

const serviceRegistryAddress = `${config.serverSSLEnabled ? 'https' : 'http'}://${config.srAddress}:${config.srPort}/serviceregistry`

/*
  Checking the core system's availability
 */
export async function echo() {
  return new Promise(async (resolve, reject) => {

  let response = null
  const source = axios.CancelToken.source()

  setTimeout(() => {
    if (response === null) {
      source.cancel('Service Registry is not available...')
    }
  }, 1000)

  response = await networkService.get(serviceRegistryAddress + '/echo', {cancelToken: source.token})
    .then(response => {
      return resolve('Service Registry is accessible')
    }).catch(error => {
      if(axios.isCancel(error)){
        return reject(error.message)
      }
      return reject(error)
    })
  })
}

/*
  Registering the System with its service into the Service Registry
 */
export async function register(force = false){
  const serviceRegistryObject = {
      endOfValidity: "2020-12-05 23:59:59",
      interfaces: [
        "HTTP-SECURE-JSON"
      ],
      providerSystem: {
        address: config.serverAddress,
        authenticationInfo: 'TODO',
        port: config.serverPort,
        systemName: config.clientSystemName
      },
      secure: 'TOKEN',
      serviceDefinition: 'Temperature',
      serviceUri: "/temperature",
      version: 1
    }
   return new Promise((resolve, reject) => {
   networkService.post(serviceRegistryAddress + '/register', serviceRegistryObject)
      .then((response) => {
        return resolve('Successfully registered service into Service Registry', response.data)
      })
      .catch(async error => {
        if(error.response.data.exceptionType === 'INVALID_PARAMETER'){
          if(force){
            unregister().then((unregisterResponse) => {
              register(false)
            })
            return resolve('Successfully force registered service into Service Registry', response2)
          }
          return resolve('Service is already registered into Service Registry')

        }
        return reject(error.response.data.errorMessage)
      })
   })
}

/*
  Unregistering the System from the Service Registry
 */
export async function unregister() {
  console.log('Removing service: Temperature from Service Registry...')
  const queryParams = {
    system_name: config.clientSystemName,
    address: config.serverAddress,
    port: config.serverPort,
    service_definition: 'Temperature'
  }

  return new Promise((resolve, reject) => {

  networkService.delete(serviceRegistryAddress + '/unregister', {params: queryParams})
    .then((response) => {
      if(response.status === 200) {
        return resolve(`Successfully removed ${config.clientSystemName} with Temperature service from SR`)
      }
    })
    .catch(error => {
      console.log('Error removing service', error)
      return reject(error.res)
    })
  })
}
