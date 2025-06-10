package com.staynguide.backend.mapapi.controller;

import com.staynguide.backend.mapapi.dto.PlaceInfo;
import com.staynguide.backend.mapapi.entity.Place;
import com.staynguide.backend.mapapi.repository.PlaceRepository;
import com.staynguide.backend.mapapi.service.PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
public class PlaceController {

    private final PlaceRepository placeRepository;
    private final PlaceService placeService;

    public PlaceController(
            PlaceRepository placeRepository,
            PlaceService placeService
    ) {
        this.placeRepository = placeRepository;
        this.placeService = placeService;
    }


    // 전체 장소 조회
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // 특정 ID 장소 조회
    @GetMapping("/{id}")
    public Place getPlaceById(@PathVariable Integer id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 ID의 장소가 없습니다."));
    }

    // 추천 API (Redis 캐시 활용)
    @GetMapping("/{id}/recommendations")
    public List<PlaceInfo> getRecommendations(@PathVariable Integer id) {
        return placeService.getRecommendations(id);
    }
}
