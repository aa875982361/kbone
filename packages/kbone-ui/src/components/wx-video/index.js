import Hover from '../hover'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxVideo extends Hover {
    static get observedAttributes() {
        return [
            'src',
            'autoplay',
            'controls',
            'loop',
            'muted',
            'poster',
            'initial-time',
            'direction',
            'show-fullscreen-btn',
            'show-play-btn',
            'show-center-play-btn'
        ]
    }

    constructor() {
        super()
        this.initShadowRoot(template, WxVideo.observedAttributes, () => {
            this.video = this.shadowRoot.querySelector('video')
            this._initEvents()
        })
    }

    static register() {
        customElements.define('wx-video', WxVideo)
    }

    _initEvents() {
        // 映射原生事件到自定义事件
        const events = [
            'play',
            'pause',
            'ended',
            'timeupdate',
            'waiting',
            'error',
            'progress'
        ]

        events.forEach(eventName => {
            this.video.addEventListener(eventName, (e) => {
                this.dispatchEvent(new CustomEvent(`bind${eventName}`, {
                    detail: this._getEventDetail(),
                    event: e,
                }))
            })
        })
    }

    _getEventDetail() {
        return {
            duration: this.video.duration,
            currentTime: this.video.currentTime,
            buffered: this.video.buffered,
        // 可以添加更多属性
        }
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'src':
                // 直接设置 video 元素的 src
                this.video.src = newVal || ''
                this.video.load() // 必须重新加载
                break
            case 'poster':
                this.video.poster = newVal
                break
            case 'autoplay':
                this.video.autoplay = newVal !== null
                break
            case 'controls':
                this.video.controls = newVal !== null
                break
            case 'loop':
                this.video.loop = newVal !== null
                break
            case 'muted':
                this.video.muted = newVal !== null
                break
            case 'initial-time':
                this.video.currentTime = parseFloat(newVal) || 0
                break
            default:
                console.warn(`未处理的属性 ${name}`)
                break
                // 其他属性处理...
        }
    }

    // 暴露视频控制方法
    play() {
        return this.video.play()
    }

    pause() {
        return this.video.pause()
    }

    seek(time) {
        this.video.currentTime = time
    }

    requestFullscreen() {
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen()
        }
    }

    // 属性getter/setter
    get src() {
        return this.getAttribute('src')
    }

    set src(value) {
        this.setAttribute('src', value)
    }
}
