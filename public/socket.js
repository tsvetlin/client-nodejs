$(function () {
  //  make connection
  const socket = io.connect('https://10.9.2.25:5000')

  const area0 = $('#area0')
  const area1 = $('#area1')

  //  Receive colorful balls
  socket.on('balldemo', (data) => {
    const area0Object = Object.entries(data.area[0])
    const area1Object = Object.entries(data.area[1])

    let area0HTML = ''
    let area1HTML = ''

    for (const [key, value] of area0Object) {
      for (let i = 0; i < value; i++) {
        area0HTML = area0HTML.concat(`<div class="${key}"></div>`)
      }
    }

    for (const [key, value] of area1Object) {
      for (let i = 0; i < value; i++) {
        area1HTML = area1HTML.concat(`<div class="${key}"></div>`)
      }
    }

    console.log(area0HTML)
    console.log(area1HTML)
    area0.html(area0HTML)
    area1.html(area1HTML)
  })
})
