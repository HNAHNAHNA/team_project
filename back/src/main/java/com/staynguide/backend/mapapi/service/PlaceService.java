package com.staynguide.backend.mapapi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staynguide.backend.mapapi.dto.PlaceInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlaceService {

    @Value("${mapapi.google.key}")
    private String apiKey;

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

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

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

                PlaceInfo info = new PlaceInfo();

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
        }

        return results;
    }
}