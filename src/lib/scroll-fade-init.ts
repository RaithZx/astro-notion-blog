export function initScrollFade(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-scroll-fade]').forEach((el) => {
    const wrap = el.parentElement
    if (!wrap) return
    const left = wrap.querySelector<HTMLElement>('.scroll-fade-left')
    const right = wrap.querySelector<HTMLElement>('.scroll-fade-right')
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      if (left) left.style.opacity = el.scrollLeft > 4 ? '1' : '0'
      if (right) right.style.opacity = el.scrollLeft < max - 4 ? '1' : '0'
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
  })
}
