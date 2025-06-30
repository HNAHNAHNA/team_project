export {}; // 파일이 모듈로 인식되도록 함

declare global {
  interface Window {
    google: typeof google.maps;
  }
}