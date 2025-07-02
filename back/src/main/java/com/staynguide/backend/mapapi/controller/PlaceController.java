package com.staynguide.backend.mapapi.controller;

import com.staynguide.backend.mapapi.dto.PlaceInfo;
import com.staynguide.backend.mapapi.entity.Place;
import com.staynguide.backend.mapapi.repository.PlaceRepository;
import com.staynguide.backend.mapapi.service.PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "localhost:5173")
public class PlaceController{

    private final PlaceRepository placeRepository;
    private final PlaceService placeService;

    public PlaceController(
            PlaceRepository placeRepository,
            PlaceService placeService
    ) {
        this.placeRepository = placeRepository;
        this.placeService = placeService;
    }

    @GetMapping
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @GetMapping("/recommendations")
    public Map<String, List<PlaceInfo>> getSplitRecommendations(@RequestParam String hotelName, @RequestParam String region) {
        return placeService.getSplitRecommendations(hotelName, region);
    }


}