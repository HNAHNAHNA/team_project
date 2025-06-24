export {};

declare global {
  interface Window {
    google: typeof google;
  }

  // 이 줄을 추가해야 "google" 네임스페이스 에러가 사라짐
  namespace google {
    export = google;
  }
}