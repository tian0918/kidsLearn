export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)

    // 1️⃣ 静态资源：直接取
    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$/)
    ) {
      return env.ASSETS.fetch(request)
    }

    // 2️⃣ 其余路径：统一回退到 index.html
    return env.ASSETS.fetch(
      new Request(new URL('/index.html', request.url), request)
    )
  }
}
