/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 30.
 */

import networkService from '../network/networkService'
import { config } from '../../config/config'
import qs from 'qs'

/*
  Checking the core system's availability
 */
export function echo() {
  return new Promise((resolve, reject) => {
    networkService.get(config.serviceRegistryURL + '/echo')
      .then((response) => {
        return resolve(response.data)
      })
      .catch((error) => {
        return reject(error.response.data.errorMessage)
      })
  })
}

/*
  Registering the System with its service into the Service Registry
 */
export function register(force = false){
  if(!config.providerPort || !config.providerSystemName || !config.providerAddress || !config.providerSecure){
    console.log('Missing environmental variables, now exiting')
    process.exit()
  }


  // If you want to register multiple services, just create an array and loop through it, calling this function.
  // https://github.com/arrowhead-f/core-java-spring#serviceregistry_endpoints_post_register
  const serviceRegistryObject = {
      endOfValidity: "2020-12-05 23:59:59",
      interfaces: [
        "HTTP-SECURE-JSON"
      ],
      providerSystem: {
        address: config.providerAddress,
        authenticationInfo: config.providerPublicKey,
        port: config.providerPort,
        systemName: config.providerSystemName
      },
      secure: config.providerSecure,
      serviceDefinition: config.providerServiceDefinition,
      serviceUri: "/temperature",
      version: 1
    }

  return new Promise((resolve, reject) => {
    networkService.post(config.serviceRegistryURL + '/register', serviceRegistryObject)
      .then((response) => {
        return resolve(response.data)
      })
      .catch(error => {
        if(force && error.response.data.exceptionType === 'INVALID_PARAMETER'){
          console.log('Force Registering SR entry')
        }
        return reject(error.response.data.errorMessage)
      })
  })

}

/*
  Unregistering the System from the Service Registry
 */
export function unregister() {
  if(!config.providerPort || !config.providerSystemName || !config.providerAddress || !config.providerServiceDefinition){
    console.log('Missing environmental variables, now exiting')
    process.exit()
  }

  const queryParams = {
    systemName: config.providerSystemName,
    address: config.providerAddress,
    port: config.providerPort,
    serviceDefinition: config.providerServiceDefinition
  }

  return new Promise((resolve, reject) => {
    networkService.delete(config.serviceRegistryURL + '/unregister', {params: queryParams})
      .then(response => {
        return resolve(response.data)
      })
      .catch(error => {
        return reject(error.response.data)
      })
  })
}
