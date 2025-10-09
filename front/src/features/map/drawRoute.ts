export function drawEncodedPolylineOnMap(
  map: google.maps.Map,
  encoded: string
): google.maps.Polyline {
  const path = google.maps.geometry.encoding.decodePath(encoded);
  const polyline = new google.maps.Polyline({
    path,
    strokeOpacity: 1.0,
    strokeWeight: 5,
    // 색상은 기본(테마)로 두는 게 가이드라인 상 좋아요. 필요시 strokeColor 지정
    map,
  });
  return polyline;
}