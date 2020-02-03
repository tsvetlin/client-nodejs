/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import './dotenv'

export const config = {
  orchestratorURL: process.env.ORCH_URL,
  consumerPort: process.env.CONSUMER_PORT,
  consumerSystemName: process.env.CONSUMER_SYSTEM_NAME,
  consumerAddress: process.env.CONSUMER_ADDRESS,
  consumerSecure: process.env.CONSUMER_SECURE,
  consumerCertName: process.env.CONSUMER_CERT_NAME,
  consumerCertPassword: process.env.CONSUMER_CERT_PASSWORD,
  consumerPublicKey: process.env.CONSUMER_PUBLIC_KEY,
  env: process.env.NODE_ENV
}
