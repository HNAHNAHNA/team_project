package com.staynguide.backend.mapapi.service;

import com.staynguide.backend.mapapi.dto.PlaceInfo;
import com.staynguide.backend.mapapi.entity.Place;
import com.staynguide.backend.mapapi.entity.Recommendation;
import com.staynguide.backend.mapapi.repository.PlaceRepository;
import com.staynguide.backend.mapapi.repository.RecommendationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RecommendationRepository recommendationRepository;

    @Value("${google.places.api.key}")
    private String apiKey;

<<<<<<< HEAD
    public PlaceService(
            PlaceRepository placeRepository,
            RedisTemplate<String, Object> redisTemplate,
            RecommendationRepository recommendationRepository
    ) {
        this.placeRepository = placeRepository;
        this.redisTemplate = redisTemplate;
        this.recommendationRepository = recommendationRepository;
    }

=======
    public List<PlaceInfo> searchByText(String textQuery) {
        // 1. textQuery로 장소 하나 가져오기
        String textSearchUrl = "https://places.googleapis.com/v1/places:searchText";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Goog-Api-Key", apiKey);
        headers.set("X-Goog-FieldMask", String.join(",",
                "places.location"));

        String requestBody = String.format("""
                {
                    "textQuery": "%s",
                    "languageCode": "ja"
                }
                """, textQuery);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(textSearchUrl, HttpMethod.POST, entity, String.class);

        double lat, lng;
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode firstPlace = root.path("places").get(0);
            lat = firstPlace.path("location").path("latitude").asDouble();
            lng = firstPlace.path("location").path("longitude").asDouble();
        } catch (Exception e) {
            throw new RuntimeException("장소 검색 실패 또는 위치 정보 없음", e);
        }

        // 2. 해당 위치 기준으로 Nearby Search 수행
        List<PlaceInfo> allResults = new ArrayList<>();
        allResults.addAll(fetchPlacesByType(lat, lng, "restaurant", 10));
        allResults.addAll(fetchPlacesByType(lat, lng, "tourist_attraction", 10));

        return allResults;
    }

    private List<PlaceInfo> fetchPlacesByType(double lat, double lng, String type, int limit) {
        String url = String.format(
                "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=3000&type=%s&key=%s",
                lat, lng, type, apiKey);
>>>>>>> front

    public List<PlaceInfo> getRecommendations(Integer placeId) {
        String key = "recommendations:" + placeId;

<<<<<<< HEAD
        // 1. Redis 캐시 확인
        List<PlaceInfo> cached = (List<PlaceInfo>) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            System.out.println("✅ Redis 캐시에서 반환됨");
            return cached;
        }
=======
        List<PlaceInfo> results = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            String status = root.path("status").asText();
            if (!"OK".equals(status)) {
                return results;
            }

            JsonNode places = root.path("results");
            int count = 0;

            for (JsonNode node : places) {
                if (count >= limit)
                    break;

                // 숙소 관련 type은 제외
                JsonNode typesNode = node.path("types");
                boolean isLodging = false;
                for (JsonNode t : typesNode) {
                    String typeText = t.asText();
                    if (typeText.contains("lodging") || typeText.contains("hotel") || typeText.contains("guest_house")
                            || typeText.contains("inn")) {
                        isLodging = true;
                        break;
                    }
                }
                if (isLodging)
                    continue;
>>>>>>> front

        // 2. DB 조회
        List<Recommendation> stored = recommendationRepository.findByPlaceId(placeId);
        if (!stored.isEmpty()) {
            System.out.println("📦 DB에서 불러옴");
            List<PlaceInfo> converted = stored.stream().map(r -> {
                PlaceInfo info = new PlaceInfo();
                info.setName(r.getName());
                info.setAddress(r.getAddress());
                info.setLatitude(r.getLatitude());
                info.setLongitude(r.getLongitude());
                info.setRating(r.getRating());
                info.setReviewCount(r.getReviewcount());
                info.setWebsite(r.getWebsite());
                return info;
            }).toList();

<<<<<<< HEAD
            redisTemplate.opsForValue().set(key, converted, 7, TimeUnit.DAYS);
            return converted;
=======
                info.setName(node.path("name").asText());
                info.setAddress(node.path("vicinity").asText());
                info.setRating(node.path("rating").asDouble(0));

                if (typesNode.isArray() && typesNode.size() > 0) {
                    info.setCategory(typesNode.get(0).asText());
                }

                JsonNode photoArray = node.path("photos");
                if (photoArray.isArray() && photoArray.size() > 0) {
                    String photoRef = photoArray.get(0).path("photo_reference").asText();
                    String photoUrl = String.format(
                            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s",
                            photoRef, apiKey);
                    info.setPhotoUrl(photoUrl);
                }

                int reviewCount = node.path("user_ratings_total").asInt(0);
                info.setReview(reviewCount + "件のレビュー");

                results.add(info);
                count++;
            }

        } catch (Exception e) {
            throw new RuntimeException("Nearby Search 응답 파싱 실패", e);
>>>>>>> front
        }

        // 3. Google API에서 맛집 + 관광지 추천
        List<PlaceInfo> restaurants = fetchFromGoogleApi(placeId, "restaurant");
        List<PlaceInfo> attractions = fetchFromGoogleApi(placeId, "観光地");

        List<PlaceInfo> result = new ArrayList<>();
        result.addAll(restaurants.stream().limit(10).toList());
        result.addAll(attractions.stream().limit(10).toList());

        // 4. DB 저장
        List<Recommendation> toSave = result.stream().map(info -> {
            Recommendation r = new Recommendation();
            r.setPlaceId(placeId);
            r.setName(info.getName());
            r.setAddress(info.getAddress());
            r.setLatitude(info.getLatitude());
            r.setLongitude(info.getLongitude());
            r.setRating(info.getRating());
            r.setReviewcount(info.getReviewCount() != null ? info.getReviewCount() : 0);
            r.setWebsite(info.getWebsite());
            return r;
        }).toList();
        recommendationRepository.saveAll(toSave);

        // 5. Redis 저장
        redisTemplate.opsForValue().set(key, result, 7, TimeUnit.DAYS);

        return result;
    }


    // 🔁 Google API 공통 호출 함수
    private List<PlaceInfo> fetchFromGoogleApi(Integer placeId, String textQuery) {
        try {
            Place place = placeRepository.findById(placeId)
                    .orElseThrow(() -> new RuntimeException("해당 장소 없음"));

            double lat = place.getLatitude();
            double lng = place.getLongitude();

            String url = "https://places.googleapis.com/v1/places:searchText";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", apiKey);
            headers.set("X-Goog-FieldMask", "*");

            String body = """
                    {
                      "textQuery": "%s",
                      "locationBias": {
                        "circle": {
                          "center": {
                            "latitude": %f,
                            "longitude": %f
                          },
                          "radius": 5000.0
                        }
                      },
                      "languageCode": "ja",
                      "regionCode": "JP"
                    }
            """.formatted(textQuery, lat, lng);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode places = root.path("places");

            List<PlaceInfo> results = new ArrayList<>();
            for (JsonNode node : places) {
                PlaceInfo info = new PlaceInfo();
                info.setName(node.path("displayName").path("text").asText(""));
                info.setAddress(node.path("formattedAddress").asText(""));
                info.setLatitude(node.path("location").path("latitude").asDouble());
                info.setLongitude(node.path("location").path("longitude").asDouble());
                info.setRating(node.path("rating").asDouble(0));
                info.setReviewCount(node.path("userRatingCount").asInt(0));
                info.setWebsite(node.path("websiteUri").asText(""));
                results.add(info);
            }

            return results;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
