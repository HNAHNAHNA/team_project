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

    /**
     * 텍스트 검색을 통한 장소 추천 (개선된 버전)
     * @param searchText 검색할 텍스트 (일본어 포함)
     * @return 추천 장소 리스트
     */
    @SuppressWarnings("unchecked")
    public List<PlaceInfo> getRecommendationsByText(String searchText) {
        // Redis 키 생성 - 일본어/특수문자 안전하게 처리
        String safeKey = generateSafeRedisKey(searchText);
        String key = "text_search:" + safeKey;

        // 1. Redis 캐시 먼저 확인
        List<PlaceInfo> cached = (List<PlaceInfo>) redisTemplate.opsForValue().get(key);
        if (cached != null && !cached.isEmpty()) {
            System.out.println("✅ Redis 캐시에서 텍스트 검색 결과 반환: " + searchText);
            return cached;
        }

        // 2. Redis에 없으면 Google API로 텍스트 서치 실행
        System.out.println("🔍 Google API 텍스트 서치 실행: " + searchText);
        List<PlaceInfo> searchResults = performTextSearch(searchText);

        // 3. 검색 결과를 Redis에 저장 (7일간 캐싱)
        if (!searchResults.isEmpty()) {
            redisTemplate.opsForValue().set(key, searchResults, 7, TimeUnit.DAYS);
            System.out.println("💾 Redis에 텍스트 검색 결과 저장됨: " + key);
        }

        return searchResults;
    }

    /**
     * 기존 추천 로직 (placeId 기반)
     */
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
            List<PlaceInfo> converted = stored.stream().map(this::convertToPlaceInfo).toList();

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
        saveRecommendationsToDb(placeId, result);

        // 5. Redis 저장
        redisTemplate.opsForValue().set(key, result, 7, TimeUnit.DAYS);

        return result;
    }

    /**
     * 텍스트 기반 Google Places API 검색 수행 (위치 제한 없음)
     */
    private List<PlaceInfo> performTextSearch(String textQuery) {
        try {
            String url = "https://places.googleapis.com/v1/places:searchText";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", apiKey);
            headers.set("X-Goog-FieldMask", "*");

            // 위치 바이어스 제거하고 순수하게 텍스트 검색만
            String body = String.format("""
                    {
                      "textQuery": "%s",
                      "languageCode": "ja",
                      "regionCode": "JP",
                      "maxResultCount": 20
                    }
                    """, textQuery);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            return parseGoogleApiResponse(response.getBody());

        } catch (Exception e) {
            System.err.println("❌ 텍스트 검색 실패: " + textQuery);
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * 기존 Google API 호출 함수 (리팩토링)
     */
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

            return parseGoogleApiResponse(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * Google API 응답 파싱
     */
    private List<PlaceInfo> parseGoogleApiResponse(String responseBody) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);
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

    /**
     * Recommendation -> PlaceInfo 변환
     */
    private PlaceInfo convertToPlaceInfo(Recommendation r) {
        PlaceInfo info = new PlaceInfo();
        info.setName(r.getName());
        info.setAddress(r.getAddress());
        info.setLatitude(r.getLatitude());
        info.setLongitude(r.getLongitude());
        info.setRating(r.getRating());
        info.setReviewCount(r.getReviewcount());
        info.setWebsite(r.getWebsite());
        return info;
    }

    /**
     * 추천 결과를 DB에 저장
     */
    private void saveRecommendationsToDb(Integer placeId, List<PlaceInfo> results) {
        List<Recommendation> toSave = results.stream().map(info -> {
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
    }

    /**
     * Redis 캐시 클리어 (개발/테스트용)
     */
    public void clearCache(String pattern) {
        redisTemplate.delete(redisTemplate.keys(pattern + "*"));
        System.out.println("🗑️ Redis 캐시 클리어됨: " + pattern);
    }

    /**
     * 일본어/특수문자가 포함된 텍스트를 Redis 키로 안전하게 변환
     */
    private String generateSafeRedisKey(String text) {
        try {
            // 1. 전각/반각 공백을 일반 공백으로 통일
            String normalized = text.replaceAll("[\\s　]+", " ").trim();

            // 2. Base64 인코딩으로 안전한 키 생성
            String encoded = java.util.Base64.getEncoder()
                    .encodeToString(normalized.getBytes("UTF-8"));

            // 3. 너무 긴 키는 해시값으로 축약
            if (encoded.length() > 100) {
                return String.valueOf(normalized.hashCode()).replace("-", "n");
            }

            return encoded.replaceAll("[/+=]", ""); // Redis에 안전한 문자만 남김

        } catch (Exception e) {
            // 실패시 해시값으로 대체
            return String.valueOf(text.hashCode()).replace("-", "n");
        }
    }
}