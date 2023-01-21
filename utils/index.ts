import { Prisma } from "@prisma/client"
import type { IArticle } from "../types/db"

export function Round(value: number, decimals: number = 2) {
  return Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function mapPrismaItems<T = any, U = any>(items: T[]) {
  return items.map((item) => {
    const result: T = { ...item }
    for (let key in item) {
      if (item[key] instanceof Prisma.Decimal)
        result[key] = (item[key] as any).toNumber()
      else if (item[key] instanceof Date)
        result[key] = (item[key] as any).getTime()
    }
    return result as unknown as U
  })
}

export function articlesById(articles: IArticle[]) {
  const cardById: { quantity: number, article: IArticle }[] = []
  for (let article of articles) {
    const found = cardById.find((a) => a.article.id === article.id)
    if (found)
      found.quantity++
    else {
      cardById.push({
        quantity: 1,
        article
      })
    }
  }
  return cardById
}

export function downloadFile(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const file = new Blob([content], { type });
  if ((window.navigator as any).msSaveOrOpenBlob) // IE10+
    (window.navigator as any).msSaveOrOpenBlob(file, filename);
  else { // Others
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export function strToAinsiBytes(str: string) {
  return new Uint8Array([...str].map((c) => c.charCodeAt(0) < 256 ? c.charCodeAt(0) : 0))
}

export function floatToBytes(value: number) {
  const buffer = new ArrayBuffer(4)
  new DataView(buffer).setFloat32(0, value, true)
  return new Uint8Array(buffer)
}

export function intToBytes(value: number) {
  const buffer = new ArrayBuffer(4)
  new DataView(buffer).setUint32(0, value, true)
  return new Uint8Array(buffer)
}

export function bytesToInt(bytes: number[]) {
  const buffer = new ArrayBuffer(4)
  new Uint8Array(buffer).set(new Uint8Array(bytes))
  return new DataView(buffer).getUint32(0, true)
}

export function bytesToStr(bytes: number[]) {
  return String.fromCharCode(...bytes).replace(/\0/g, '')
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}