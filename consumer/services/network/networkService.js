/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 30.
 */

import axios from 'axios'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { config } from '../../config/config'

const httpsAgent = new https.Agent({
  rejectUnauthorized: true,
  pfx: fs.readFileSync(path.resolve(__dirname, `../../certificates/${config.consumerCertName}`)),
  passphrase: config.consumerCertPassword
})

const instance = axios.create({ httpsAgent })

export default instance
