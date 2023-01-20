import toast from "react-hot-toast"
import { bytesToInt, bytesToStr, floatToBytes, intToBytes, strToAinsiBytes } from "../utils"

export const PACKET_IDS = {
  PING: 0x01,
  PONG: 0x02,
  SHOW_MESSAGE: 0x10,
  OPEN_POPUP: 0x11,
  CREATE_CARD: 0x20,
  CANCEL_CREATE: 0x21,
  RESPONSE: 0x22,
  ASK_PAY: 0x30,
  CANCEL_PAY: 0x31,
  TRY_PAY: 0x32,
  PAY_RESPONSE: 0x33,
  ASK_READ: 0x40,
  CANCEL_READ: 0x41,
  READ_RESPONSE: 0x42,
}

export enum EsipayPaiementResponseStatus {
  OK = 0x00,
  NOT_ENOUGH_MONEY = 0x01,
  UNKNOWN_CARD = 0x02,
  UNKNOWN_ERROR = 0x03,
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

    this.on(PACKET_IDS.OPEN_POPUP, (data) => {
      toast("EsiPay: " + bytesToStr(data))
    })

    return true
  }

  isConnected() {
    return !!this.port?.readable
  }

  async read() {
    if (!this.port?.readable) return

    console.log("Reading...")
    while (this.port.readable) {
      const reader = this.port.readable.getReader()
      try {
        let buffer = new Uint8Array([])
        while (true) {
          const { value, done } = await reader.read()
          if (value) {
            console.log("read", value)
            buffer = new Uint8Array([...buffer, ...value])
            if (buffer.length >= buffer[0]) {
              const packetId = buffer[1]
              const data = buffer.slice(2)
              console.log("packet", packetId, data)
              buffer = new Uint8Array([])
              if (this.eventListeners.has(packetId))
                this.eventListeners.get(packetId)!.forEach((callback) => callback([...data]))
            }
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
      bytes = strToAinsiBytes(data)
    else if (data instanceof Uint8Array)
      bytes = data
    else if (Array.isArray(data))
      bytes = new Uint8Array(data)
    else
      bytes = new Uint8Array([])

    bytes = new Uint8Array([
      bytes.length + 1, // packet size
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

  sendAndWaitReturn(sendPacketId: number, receivePacketId: number, data: string | Uint8Array | number[]): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.once(receivePacketId, (result) => {
        resolve(result)
      })
      this.write(sendPacketId, data)
    })
  }

  async ping() {
    const result = await this.sendAndWaitReturn(PACKET_IDS.PING, PACKET_IDS.PONG, [0x0b])
    return bytesToStr(result)
  }

  async showMessage(duration: number, title: string, message: string) {
    const durationBuffer = new Uint8Array([duration])
    const titleBuffer = new Uint8Array(new Array(12).fill(0))
    const messageBuffer = new Uint8Array(new Array(220).fill(0))
    titleBuffer.set(strToAinsiBytes(title))
    messageBuffer.set(strToAinsiBytes(message))
    await this.write(PACKET_IDS.SHOW_MESSAGE, [...durationBuffer, ...titleBuffer, ...messageBuffer])
  }

  async writeCard(idEsipay: Uint8Array, firstname: string, lastname: string, timestamp: number, idUb: string) {
    const idEsipayBuffer = new Uint8Array(new Array(8).fill(0))
    const firstnameBuffer = new Uint8Array(new Array(28).fill(0))
    const lastnameBuffer = new Uint8Array(new Array(28).fill(0))
    const timestampBuffer = new Uint8Array(new Array(4).fill(0))
    const idUbBuffer = new Uint8Array(new Array(16).fill(0))
    idEsipayBuffer.set(idEsipay.slice(0, 8))
    firstnameBuffer.set(strToAinsiBytes(firstname))
    lastnameBuffer.set(strToAinsiBytes(lastname))
    timestampBuffer.set(intToBytes(Math.round(timestamp / 1000)))
    idUbBuffer.set(strToAinsiBytes(idUb))
    await this.write(PACKET_IDS.CREATE_CARD, [...idEsipayBuffer, ...firstnameBuffer, ...lastnameBuffer, ...timestampBuffer, ...idUbBuffer])
  }

  async cancelWrite() {
    await this.write(PACKET_IDS.CANCEL_CREATE, [])
  }

  async askPayment(amount: number) {
    const amountBuffer = floatToBytes(amount)
    const result = await this.sendAndWaitReturn(PACKET_IDS.ASK_PAY, PACKET_IDS.TRY_PAY, [...amountBuffer])
    return bytesToStr(result.slice(0, 8))
  }

  async cancelPayment() {
    await this.write(PACKET_IDS.CANCEL_PAY, [])
  }

  async paiementResponse(status: EsipayPaiementResponseStatus, amount: number) {
    const statusBuffer = new Uint8Array([status])
    const amountBuffer = floatToBytes(amount)
    await this.write(PACKET_IDS.PAY_RESPONSE, [...statusBuffer, ...amountBuffer])
  }

  async askRead() {
    const result = await this.sendAndWaitReturn(PACKET_IDS.ASK_READ, PACKET_IDS.READ_RESPONSE, [])
    return {
      success: result[0] === 0,
      idEsipay: result.slice(1, 9),
      firstname: bytesToStr(result.slice(9, 37)),
      lastname: bytesToStr(result.slice(37, 65)),
      timestamp: bytesToInt(result.slice(65, 69)) * 1000,
      idUb: bytesToStr(result.slice(69, 85)),
    }
  }

  async cancelRead() {
    await this.write(PACKET_IDS.CANCEL_READ, [])
  }

}

const esipay = new EsiPay()
if (typeof window !== 'undefined' && !(window as any).esipay) (window as any).esipay = esipay
export default esipay