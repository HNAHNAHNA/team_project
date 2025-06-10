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

    public PlaceService(
            PlaceRepository placeRepository,
            RedisTemplate<String, Object> redisTemplate,
            RecommendationRepository recommendationRepository
    ) {
        this.placeRepository = placeRepository;
        this.redisTemplate = redisTemplate;
        this.recommendationRepository = recommendationRepository;
    }


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

        List<PlaceInfo> restaurants = fetchFromGoogleApi(placeId, "restaurant");
        List<PlaceInfo> attractions = fetchFromGoogleApi(placeId, "観光地");
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
