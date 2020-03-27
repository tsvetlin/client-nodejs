/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 23.
 */

import {orchestration} from '../arrowhead/orchestrator'
import {serviceRequestFormDashboard} from '../../utils/systemUtils'
import networkService from '../network/networkService'
import {config} from '../../config/config'
import axios from 'axios'
import {app} from '../../app'

let historian = {}

const timeout = 60000

export async function getHistorianData() {
  const orchestrationResponse = await orchestration(serviceRequestFormDashboard)
  // console.log(JSON.stringify(orchestrationResponse, null, 4))

  const entry = orchestrationResponse.response[0]

  /* RESPONSE
  {
    "response": [
        {
            "provider": {
                "id": 19,
                "systemName": "datamanager_proxy",
                "address": "10.9.2.22",
                "port": 18461,
                "authenticationInfo": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm2X+sBaOY1guZ+to5RPqlbWSVf1CQtiya2P7tZ3I4wqn4bmZsdlMfThzFLEmYIyPTqrveA3zd0Fqs7EKc+cBNtf2GQx/i+dyCVI3s49zTnnxGUS66QNnyZ/Z9qUK/fHLblOoQHDwOFl2yu4/c9U7jIhAHzVXHKVktOKJbRWRb3SZi2iM4mGJ5DrsN2QCCmocTFIBsrBSXYmV7AmPEkfaMyIHoOE4XTZhM7NnBqnJkvzGoZ8hOJZ6ujnzxsJxx1cR6lZCbAyXkGml7XeoJnmNgcTGGNr7V4RKR2bFV+kopxzYHM17wlzwXHndwt/SkVSTzPGPiwxZgZqs0Udm54B9bwIDAQAB",
                "createdAt": "2020-03-21 11:18:05",
                "updatedAt": "2020-03-21 11:18:05"
            },
            "service": {
                "id": 18,
                "serviceDefinition": "fetch-from-historian-proxy",
                "createdAt": "2020-03-21 11:18:05",
                "updatedAt": "2020-03-21 11:18:05"
            },
            "serviceUri": "/datamanager_proxy/historian",
            "secure": "CERTIFICATE",
            "metadata": null,
            "interfaces": [
                {
                    "id": 1,
                    "interfaceName": "HTTP-SECURE-JSON",
                    "createdAt": "2020-03-19 14:47:28",
                    "updatedAt": "2020-03-19 14:47:28"
                }
            ],
            "version": 1,
            "authorizationTokens": null,
            "warnings": [
                "FROM_OTHER_CLOUD"
            ]
        }
    ]
}
   */

  historian = {
    address: entry.provider.address,
    port: entry.provider.port,
    serviceUri: entry.serviceUri
  }
}

/*
  Returns an array of Systems from Historian
  { systems: [ 'testsystem_0', 'opcua_system_test0' ] }
 */

export async function getHistorianSystemList(address, port, serviceUri) {
  return new Promise(async (resolve, reject) => {
    const historianAddress = `${config.serverSSLEnabled ? 'https' : 'http'}://${address}:${port}${serviceUri}`

    let response = null
    const source = axios.CancelToken.source()

    setTimeout(() => {
      if (response === null) {
        source.cancel(`getHistorianSystemList timed out after ${timeout} ms | ${historianAddress}`)
      }
    }, timeout)

    response = await networkService.get(historianAddress, {cancelToken: source.token})
      .then(response => {
        //console.log('gethistoriansystemlist', response.data)
        console.log('AAA data')
        return resolve(response.data.systems)
      })
      .catch(error => {
        if(axios.isCancel(error)){
          console.log('AAAA CANCEL')
          //return reject(error.message)
          return resolve({systems: []})
        }
        console.log(error.response.data)
        //return reject(error)
        return resolve({systems: []})
      })
  })
}

/*
  Returns an array of services provided by the requested System
  { systems: [ 'testsystem_0', 'opcua_system_test0' ] }
   transformed to:
  {"services":["testservice_0"],"systemName":"testsystem_0"}
 */
export async function getHistorianSystem(systems) {
  if (!systems) {
    return null
  }
  // console.log('DDDD', systems)
  const promises = []
  for (const systemName of systems) {
    promises.push(new Promise(async (resolve, reject) => {
      const historianAddress = `${config.serverSSLEnabled ? 'https' : 'http'}://${historian.address}:${historian.port}${historian.serviceUri}/${systemName}`
      // console.log('SYS', historianAddress)
      let response = null
      const source = axios.CancelToken.source()

      setTimeout(() => {
        if (response === null) {
          source.cancel(`getHistorianSystem timed out after ${timeout} ms | ${historianAddress}`)
        }
      }, timeout)

      response = await networkService.get(historianAddress, {cancelToken: source.token})
        .then(response => {
          //console.log('gethistoriansystem', response.data)
          console.log('BBB data')
          return resolve({...response.data, systemName})
        })
        .catch(error => {
          if(axios.isCancel(error)){
            console.log('BBB CANCEL')
            //return reject(error.message)
            return resolve({systemName, services: []})
          }
          console.log(error.response.data)
          //return reject(error)
          return resolve({systemName, services: []})
        })
    }))
  }
  return Promise.all(promises)//.catch(error => console.log('GGG', error))
}

/*
  Returns an array of data provided by requested service of the given System
  { data:
   [ { bn: 'opcua_service_test0', bt: 5 },
     { n: 'NameTest', u: 'BaseUnitTest', v: 5 },
     { n: 'NameTest', u: 'BaseUnitTest', v: 4, t: -1 } ] }
  transformed to:
  {"data":[{"bn":"opcua_service_test0","bt":5},{"n":"NameTest","u":"BaseUnitTest","v":5},{"n":"NameTest","u":"BaseUnitTest","v":4,"t":-1}],"systemName":"opcua_system_test0"}
 */
export async function getHistorianServiceData(historianData) {
  const promises = []
  for (const {systemName, services} of historianData) {
    for (const serviceDefinition of services) {
      promises.push(new Promise(async (resolve, reject) => {
        const historianAddress = `${config.serverSSLEnabled ? 'https' : 'http'}://${historian.address}:${historian.port}${historian.serviceUri}/${systemName}/${serviceDefinition}`
        console.log(historianAddress)
        let response = null
        const source = axios.CancelToken.source()

        setTimeout(() => {
          if (response === null) {
            source.cancel(`getHistorianServiceData timed out after ${timeout} ms | ${historianAddress}`)
          }
        }, timeout)

        response = await networkService.get(historianAddress, {
          cancelToken: source.token,
          params: {count: 200, to: 1619949538}
        })
          .then(response => {
            //console.log('historianServiceData', response.data)
            console.log('CCC data')
            return resolve({...response.data, systemName})
          })
          .catch(error => {
            if(axios.isCancel(error)){
              console.log('CCC cancel')
              //return reject(error.message)
              return resolve({systemName, data: []})
            }
            console.log(error.response.data)
            //return reject(error)
            return resolve({systemName, data: []})
          })
      }))
    }
  }
  return Promise.all(promises)//.catch(error => console.log('XXX', error))
}

export async function getHistorianDataForDashboard() {
  const r = await getHistorianSystemList(historian.address, historian.port, historian.serviceUri).catch(error => {/*ignored*/
  })
  if (!r) {
    return false
  }
  const e = await getHistorianSystem(r).catch(error => {/*ignored*/
  })
  if (!e) {
    return false
  }
  const s = await getHistorianServiceData(e).catch(error => {/*ignored*/
  })
  if (!s) {
    return false
  }
  // console.log('Aggregated data from historian:\n', JSON.stringify(s, null, 4))

  const aggregated = []
  for (const entry of s) {
    const o = {}
    o.systemName = entry.systemName
    let data = entry.data
    if (data.length) {
      const service = data[0]
      if (!service.bt) {
        service.bt = 0
      }
      o.service = service
      data.shift()
      let helperObject = {}
      for (const element of data) {
        if (!helperObject[element.n]) {
          element.t = element.t ? o.service.bt - element.t : ''
          helperObject[element.n] = [element]
        } else {
          element.t = element.t ? o.service.bt - element.t : ''
          helperObject[element.n].push(element)
        }
      }
      o.signals = helperObject
    }
    aggregated.push(o)
  }

  // console.log(JSON.stringify(aggregated, null, 4))

  /* [
    {
        "data": [
            {
                "bn": "testservice_0",
                "bt": 0
            },
            {
                "n": "string",
                "u": "string",
                "v": 0,
                "vs": "string",
                "vb": true
            }
        ],
        "systemName": "testsystem_0"
    },
    {
        "data": [
            {
                "bn": "opcua_service_test0",
                "bt": 1585128264
            },
            {
                "n": "M01Per_SerialNumber",
                "u": "",
                "v": 2359
            },
            {
                "n": "M01Per_SerialNumber",
                "u": "",
                "v": 2359,
                "t": 0
            },
            {
                "n": "M01Per_SerialNumber",
                "u": "",
                "v": 2359,
                "t": 0
            },
            {
                "n": "M01Per_ProductId",
                "u": "",
                "v": 4,
                "t": 0
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_SerialNumber",
                "u": "",
                "v": 2359,
                "t": 0
            },
            {
                "n": "M01Per_ProductId",
                "u": "",
                "v": 4,
                "t": 0
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_PowerLEL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_PowerUCL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_PowerLCL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_Power",
                "u": "kW",
                "v": 288.316,
                "t": 0
            },
            {
                "n": "M01Per_Length",
                "u": "m",
                "v": 7.49206,
                "t": 0
            },
            {
                "n": "M01Per_SerialNumber",
                "u": "",
                "v": 2359,
                "t": 0
            },
            {
                "n": "M01Per_ProductId",
                "u": "",
                "v": 4,
                "t": 0
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_PowerLEL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_PowerUCL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_PowerLCL",
                "u": "kW",
                "v": 0,
                "t": 0
            },
            {
                "n": "M01Per_Power",
                "u": "kW",
                "v": 288.316,
                "t": 0
            },
            {
                "n": "M01Per_Speed",
                "u": "m/min",
                "v": 25,
                "t": 0
            },
            {
                "n": "M01Per_Length",
                "u": "m",
                "v": 7.49206,
                "t": 0
            },
            {
                "n": "M01Per_ForceStp",
                "u": "Nm",
                "v": 9.5,
                "t": 0
            },
            {
                "n": "M01Per_Force",
                "u": "Nm",
                "v": 9.42194,
                "t": 0
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerLEL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerUCL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerLCL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_Power",
                "u": "kW",
                "v": 392.384,
                "t": -653
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerLEL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerUCL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerLCL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_Power",
                "u": "kW",
                "v": 392.384,
                "t": -653
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerLEL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerUCL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_PowerLCL",
                "u": "kW",
                "v": 0,
                "t": -653
            },
            {
                "n": "M01Per_Power",
                "u": "W",
                "v": 392.384,
                "t": -653
            },
            {
                "n": "M01Per_SerialNumber",
                "v": 2321,
                "t": -1134
            },
            {
                "n": "M01Per_ProductId",
                "v": 1,
                "t": -1134
            },
            {
                "n": "M01Per_PowerUEL",
                "v": 0,
                "t": -1134
            },
            {
                "n": "M01Per_SerialNumber",
                "u": "",
                "v": 10,
                "t": -1585128258
            },
            {
                "n": "M01Per_ProductId",
                "u": "",
                "v": 16451,
                "t": -1585128258
            },
            {
                "n": "M01Per_PowerUEL",
                "u": "W",
                "v": 16.32,
                "t": -1585128258
            },
            {
                "n": "M01Per_PowerLEL",
                "u": "W",
                "v": 18.98,
                "t": -1585128258
            },
            {
                "n": "NameTest",
                "u": "BaseUnitTest",
                "v": 5,
                "t": -1585128259
            },
            {
                "n": "NameTest",
                "u": "BaseUnitTest",
                "v": 4,
                "t": -1585128260
            }
        ],
        "systemName": "opcua_system_test0"
    }
]
*/

  /*
  const aggregated = [
    {
      'systemName': 'opcua_system_test0',
      'service': {
        'bn': 'opcua_service_test0',
        'bt': 1585130125
      },
      'offerings': {
        'M01Tra_PowerULEL': [
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 0,
            't': 1585153140
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 1,
            't': 1585153141
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 2,
            't': 1585153142
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 3,
            't': 1585153143
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 4,
            't': 1585153144
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 5,
            't': 1585153145
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 6,
            't': 1585153146
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 7,
            't': 1585153147
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 8,
            't': 1585153148
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 9,
            't': 1585153149
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 10,
            't': 1585153150
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 4,
            't': 1585153151
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 20,
            't': 1585153152
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 30,
            't': 1585153153
          },
          {
            'n': 'M01Tra_PowerULEL',
            'u': 'kW',
            'v': 5,
            't': 1585153154
          }
        ]
      }
    }
  ]*/

  if (aggregated !== []) {
    console.log('Data sent')
    app.io.emit('historian', aggregated)
  }
}
