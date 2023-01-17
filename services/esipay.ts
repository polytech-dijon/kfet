export const PACKET_IDS = {
  PING: 0x01,
  PONG: 0x02,
  SHOW_MESSAGE: 0x10,
  OPEN_POPUP: 0x11,
  CREATE_CARD: 0x20,
  CANCEL: 0x21,
  RESPONSE: 0x22,
  ASK_PAY: 0x30,
  TRY_PAY: 0x32,
  PAY_RESPONSE: 0x33,
  ASK_READ: 0x40,
  READ_RESPONSE: 0x42,
}

class EsiPay {

  private port: SerialPort | null = null
  private eventListeners: Map<number, ((data: number[]) => void)[]> = new Map()

  async start(): Promise<boolean> {
    if (!navigator.serial) {
      console.error("Web Serial API not supported in this browser")
      return false
    }

    if (this.port) {
      console.log("EsiPay already connected")
      return true
    }

    try {
      const port = await navigator.serial.requestPort({ filters: [] })
      console.log(port)
      this.port = port
      await this.port.open({ baudRate: 115200 })
      this.read()
    }
    catch (e) {
      return false
    }

    return true
  }

  isConnected() {
    return !!this.port?.readable
  }

  async read() {
    if (!this.port?.readable) return

    while (this.port.readable) {
      const reader = this.port.readable.getReader()
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (value) {
            const arr = Array.from<any>(value)
            const packetSize: number = arr.shift()
            const packetId: number = arr.shift()
            const data = arr.slice(1)
            if (this.eventListeners.has(2))
              this.eventListeners.get(2)!.forEach((callback) => callback(data))
          }
          if (done) break
        }
      } catch (error) {
        console.log(error)
      } finally {
        reader.releaseLock()
      }
    }
  }

  async write(packetId: number, data: string | Uint8Array | number[]) {
    if (!this.port?.writable) return

    const writer = this.port.writable.getWriter()

    let bytes: Uint8Array
    if (typeof data === 'string')
      bytes = new Uint8Array([...data].map((c) => c.charCodeAt(0)))
    else if (data instanceof Uint8Array)
      bytes = data
    else if (Array.isArray(data))
      bytes = new Uint8Array(data)
    else
      bytes = new Uint8Array([])

    bytes = new Uint8Array([
      bytes.length - 1, // packet size
      packetId, // packet id
      ...bytes, // data
    ])
    console.log("write", [...bytes])

    await writer.write(bytes)

    writer.releaseLock()
  }

  on(packetId: number, callback: (data: number[]) => void) {
    if (!this.eventListeners.has(packetId)) this.eventListeners.set(packetId, [])
    this.eventListeners.get(packetId)!.push(callback)
  }

  once(packetId: number, callback: (data: number[]) => void) {
    const onceCallback = (data: number[]) => {
      callback(data)
      this.off(packetId, onceCallback)
    }
    this.on(packetId, onceCallback)
  }

  off(packetId: number, callback: (data: number[]) => void) {
    if (!this.eventListeners.has(packetId)) return
    this.eventListeners.set(packetId, this.eventListeners.get(packetId)!.filter((cb) => cb !== callback))
  }

  ping(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.once(PACKET_IDS.PONG, (data) => {
        const str = String.fromCharCode(...data)
        resolve(str)
      })
      this.write(PACKET_IDS.PING, [0x0b])
    })
  }

}

const esipay = new EsiPay()
if (typeof window !== 'undefined' && !(window as any).esipay) (window as any).esipay = esipay
export default esipay