/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 02. 04.
 */
import colors from 'colors'
import { dotenvConfig } from '../config/dotenv'
import { getBool } from './utils'
import { echo } from '../services/arrowhead/serviceRegistry'

export function validateENV() {
  console.log('Starting .env validation')

  let config = dotenvConfig.parsed
  const sslEnabled = getBool(config.SERVER_SSL_ENABLED)

  if(!sslEnabled){
    config = Object.keys(config)
      .filter(key =>
        !key.includes('SERVER_SSL_', 0) &&
        !key.includes('TOKEN_', 0))
      .reduce( (res, key) => (res[key] = config[key], res), {} )
  }

  let missing = false

  for(const key in config){
    if(!config[key]){
      console.log(`ERROR: Missing ${key} from .env!`.red)
      missing = true
    }
  }

  if(missing){
    console.log('Please fix your .env and restart the application\nNow exiting...')
    process.exit()
  }

  console.log('.env validation finished successfully'.green)
}
