/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import './dotenv'

export const config = {
  serviceRegistryURL: process.env.SR_URL,
  providerPort: process.env.PROVIDER_PORT,
  providerSystemName: process.env.PROVIDER_SYSTEM_NAME,
  providerAddress: process.env.PROVIDER_ADDRESS,
  providerSecure: process.env.PROVIDER_SECURE,
  providerServiceDefinition: process.env.PROVIDER_SERVICE_DEFINITION,
  providerCertName: process.env.PROVIDER_CERT_NAME,
  providerCertPassword: process.env.PROVIDER_CERT_PASSWORD,
  providerPublicKey: process.env.PROVIDER_PUBLIC_KEY,
  env: process.env.NODE_ENV
}
