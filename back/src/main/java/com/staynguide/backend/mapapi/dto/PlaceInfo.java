package com.staynguide.backend.mapapi.dto;


public class PlaceInfo {
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private double rating;
    private Integer reviewcount;
    private String website;
    private String imageurl;


    public PlaceInfo() {
        // 기본 생성자 - 직렬화/역직렬화 혹은 DTO 용도로 사용
        }

    // getter & setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewcount;
    }

    public void setReviewCount(Integer reviewacount) {
        this.reviewcount = reviewacount;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getImageurl() {
        return imageurl;
    }

    public void setImageurl(String imageurl) {
        this.imageurl = imageurl;
    }
}
