// next.config 의 basePath 와 동기화. <video>, <img> 등 Next 가 자동 prefix 하지 않는
// raw 태그에서 사용한다. dev 서버에서는 빈 문자열이라 그대로 동작.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
