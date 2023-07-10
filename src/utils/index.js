/**
 * 图片 url 转 base64
 */
export function getBase64ByImageUrl(imageUrl) {
    return new Promise(resolve => {
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onloadend = () => {
                    resolve(reader.result)
                }
            })
    })
}