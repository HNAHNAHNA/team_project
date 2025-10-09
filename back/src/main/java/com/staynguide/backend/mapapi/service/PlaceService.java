package com.staynguide.backend.mapapi.service;

import com.staynguide.backend.mapapi.dto.PlaceInfo;
import com.staynguide.backend.mapapi.entity.Recommendation;
import com.staynguide.backend.mapapi.repository.RecommendationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class PlaceService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RecommendationRepository recommendationRepository;

    @Value("${google.places.api.key}")
    private String apiKey;

    public PlaceService(
            RedisTemplate<String, Object> redisTemplate,
            RecommendationRepository recommendationRepository
    ) {
        this.redisTemplate = redisTemplate;
        this.recommendationRepository = recommendationRepository;
    }

    // 호텔명+지역 → 맛집·관광지 10개씩 반환
    public Map<String, List<PlaceInfo>> getSplitRecommendations(String hotelName, String region) {
        // 1. 호텔 위도/경도 얻기 (텍스트 검색)
        PlaceInfo hotelInfo = findHotelLocation(hotelName, region);
        if (hotelInfo == null) {
            Map<String, List<PlaceInfo>> empty = new HashMap<>();
            empty.put("restaurants", Collections.emptyList());
            empty.put("attractions", Collections.emptyList());
            return empty;
        }

        double lat = hotelInfo.getLatitude();
        double lng = hotelInfo.getLongitude();

        // 2. 주변 맛집 10개
        List<PlaceInfo> restaurants = searchNearby(lat, lng, "restaurant", 10);

        // 3. 주변 관광지 10개
        List<PlaceInfo> attractions = searchNearby(lat, lng, "tourist_attraction", 10);

        Map<String, List<PlaceInfo>> result = new HashMap<>();
        result.put("restaurants", restaurants);
        result.put("attractions", attractions);

        return result;
    }

    // 호텔 위치를 검색해서 PlaceInfo로 반환
    public PlaceInfo findHotelLocation(String hotelName, String region) {
        String textQuery = hotelName + " " + region;
        try {
            String url = "https://places.googleapis.com/v1/places:searchText";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", apiKey);
            headers.set("X-Goog-FieldMask", "*");

            String body = String.format("""
                    {
                      "textQuery": "%s",
                      "languageCode": "ja",
                      "regionCode": "JP",
                      "maxResultCount": 1
                    }
                    """, textQuery);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode places = root.path("places");
            if (!places.isArray() || places.size() == 0) return null;

            JsonNode hotel = places.get(0);
            PlaceInfo info = new PlaceInfo();
            info.setName(hotel.path("displayName").path("text").asText(""));
            info.setAddress(hotel.path("formattedAddress").asText(""));
            info.setLatitude(hotel.path("location").path("latitude").asDouble());
            info.setLongitude(hotel.path("location").path("longitude").asDouble());
            info.setRating(hotel.path("rating").asDouble(0));
            info.setReviewCount(hotel.path("userRatingCount").asInt(0));
            info.setWebsite(hotel.path("websiteUri").asText(""));
            return info;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Nearby Search API로 장소 검색 (type: "restaurant" or "tourist_attraction")
    private List<PlaceInfo> searchNearby(double lat, double lng, String type, int limit) {
        try {
            String url = "https://places.googleapis.com/v1/places:searchNearby";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", apiKey);
            headers.set("X-Goog-FieldMask", "*");

            String body = String.format("""
                    {
                      "includedTypes": ["%s"],
                      "locationRestriction": {
                        "circle": {
                          "center": {
                            "latitude": %f,
                            "longitude": %f
                          },
                          "radius": 1000
                        }
                      },
                      "languageCode": "ja",
                      "regionCode": "JP",
                      "maxResultCount": %d
                    }
                    """, type, lat, lng, limit);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode places = root.path("places");

            List<PlaceInfo> results = new ArrayList<>();
            if (places.isArray()) {
                for (JsonNode node : places) {
                    String placeName = node.path("displayName").path("text").asText("");
                    if (placeName.contains("ホテル") || placeName.toLowerCase().contains("hotel")) continue;

                    PlaceInfo info = new PlaceInfo();
                    info.setName(placeName);
                    info.setAddress(node.path("formattedAddress").asText(""));
                    info.setLatitude(node.path("location").path("latitude").asDouble());
                    info.setLongitude(node.path("location").path("longitude").asDouble());
                    info.setRating(node.path("rating").asDouble(0));
                    info.setReviewCount(node.path("userRatingCount").asInt(0));
                    info.setWebsite(node.path("websiteUri").asText(""));

                    JsonNode photos = node.path("photos");
                    if (photos.isArray() && photos.size() > 0) {
                        String photoReference = photos.get(0).path("name").asText();
                        if (!photoReference.isEmpty()) {
                            String photoUrl = String.format(
                                    "https://places.googleapis.com/v1/%s/media?key=%s&maxHeightPx=400",
                                    photoReference,
                                    apiKey
                            );
                            info.setImageurl(photoUrl);
                        }
                    }

                    results.add(info);
                    if (results.size() >= limit) break;
                }
            }

            return results;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}