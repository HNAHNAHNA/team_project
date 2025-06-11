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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RecommendationRepository recommendationRepository;

    @Value("${google.places.api.key}")
    private String apiKey;

    public PlaceService(
            PlaceRepository placeRepository,
            RedisTemplate<String, Object> redisTemplate,
            RecommendationRepository recommendationRepository
    ) {
        this.placeRepository = placeRepository;
        this.redisTemplate = redisTemplate;
        this.recommendationRepository = recommendationRepository;
    }

    @SuppressWarnings("unchecked")
    public List<PlaceInfo> getRecommendations(Integer placeId) {
        String key = "recommendations:" + placeId;

        // 1. Redis 캐시 확인
        List<PlaceInfo> cached = (List<PlaceInfo>) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            System.out.println("✅ Redis 캐시에서 반환됨");
            return cached;
        }

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

            redisTemplate.opsForValue().set(key, converted, 7, TimeUnit.DAYS);
            return converted;
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
                    .orElseThrow(() -> new RuntimeException("해당 장소 없음: " + placeId));

            double lat = place.getLatitude();
            double lng = place.getLongitude();

            String url = "https://places.googleapis.com/v1/places:searchText";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", apiKey);
            headers.set("X-Goog-FieldMask", "*");

            String body = String.format("""
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
                    """, textQuery, lat, lng);

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