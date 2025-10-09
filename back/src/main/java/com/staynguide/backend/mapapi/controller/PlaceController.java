package com.staynguide.backend.mapapi.controller;

import com.staynguide.backend.mapapi.dto.PlaceInfo;
import com.staynguide.backend.mapapi.entity.Place;
import com.staynguide.backend.mapapi.repository.PlaceRepository;
import com.staynguide.backend.mapapi.service.PlaceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "15.164.229.102")
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
        @GetMapping("/hotel-location")
    public ResponseEntity<PlaceInfo> getHotelLocation(
            @RequestParam String hotelName,
            @RequestParam String region
    ) {
        PlaceInfo info = placeService.findHotelLocation(hotelName, region);
        if (info == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(info);
    }

}