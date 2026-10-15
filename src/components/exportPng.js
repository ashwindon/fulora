// Turns the garden canvas (an SVG) into a PNG the visitor can download.
export async function exportPng(svg, filename = 'my-fulora-garden.png') {
  const clone = svg.cloneNode(true)
  clone.querySelectorAll('[data-export-hide]').forEach((n) => n.remove())
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', '1600')
  clone.setAttribute('height', '1040')
  const xml = new XMLSerializer().serializeToString(clone)
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }))
  try {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = 1600
    canvas.height = 1040
    canvas.getContext('2d').drawImage(img, 0, 0, 1600, 1040)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(href), 2000)
  } finally {
    URL.revokeObjectURL(url)
  }
}
