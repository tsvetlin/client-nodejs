/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 19.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import ReactApp from './index'

ReactDOM.hydrate(
  <ReactApp {...window.__APP_INITIAL_STATE__} />,
  document.querySelector('#root'))
