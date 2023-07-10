import { getBase64ByImageUrl } from '@/utils'

console.image = async function image(url, width=50, height=50) {
    const base64 = await getBase64ByImageUrl(url)
    const style = {
        padding: `${width / 2}px ${height / 2}px`,
        background: `url(${base64}) center center no-repeat`
    }
    console.log(`%c `, Object.keys(style).map(attr => `${attr}: ${style[attr]};`).join(''))
}