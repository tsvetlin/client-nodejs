/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 05.
 */

import {config} from '../config/config'

// Utility objects for the operation of the system.

// Service(s) the system want to provide
export const serviceRegistryEntry = {
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
