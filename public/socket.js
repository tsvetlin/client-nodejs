$(function () {
  //  make connection
  const socket = io.connect('https://10.9.2.25:5000')

  const area0 = $('#area0')
  const area1 = $('#area1')
  const sensorName = $('#sensorName')
  const timestamp = $('#timestamp')
  const count0 = $('#count0')
  const count1 = $('#count1')

  //  Receive colorful balls
  socket.on('balldemo', (data) => {
    console.log(data)
    const sensorText = data.bn
    const timestampValue = moment(data.bt * 1000).format('YYYY-MM-DD HH:mm:ss')
    const area0Object = Object.entries(data.area[0])
    const area1Object = Object.entries(data.area[1])

    let area0HTML = ''
    let area1HTML = ''

    let ballCountArea0 = 0
    let ballCountArea1 = 0

    for (const [key, value] of area0Object) {
      for (let i = 0; i < value; i++) {
        ballCountArea0++
        area0HTML = area0HTML.concat(`<div class="${key}"></div>`)
      }
    }

    for (const [key, value] of area1Object) {
      for (let i = 0; i < value; i++) {
        ballCountArea1++
        area1HTML = area1HTML.concat(`<div class="${key}"></div>`)
      }
    }

    // console.log(area0HTML)
    // console.log(area1HTML)
    sensorName.text(sensorText)
    timestamp.text(timestampValue)
    count0.text(`count: ${ballCountArea0}`)
    count1.text(`count: ${ballCountArea1w}`)
    area0.html(area0HTML)
    area1.html(area1HTML)
  })
})
