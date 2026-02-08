package com.example.BharatRail.Controller;
import jakarta.persistence.*;


@Entity
@Table(name = "trains")
public class Train {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_number", unique = true, nullable = false)
    private String trainNumber;

    @Column(name = "train_name", nullable = false)
    private String trainName;

    @Column(name = "general_position")
    private String generalPosition;
    @Column(name = "expected_platform")
    private String expectedPlatform;

    @Column(name = "rush_status")
    private String rushStatus;

    @Column(name = "star_rating")
    private double starRating = 0.0;

    //    default constructor
    public Train() {
    }

//parameterize Construction

    // 1. Constructor (for data initialization)
    public Train(String trainNumber, String trainName, String generalPosition, double expectedPlatform) {
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.generalPosition = generalPosition;
//        this.expectedPlatform = expectedPlatform;
    }

    // 2. Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;

    }

    public String getGeneralPosition() {
        return generalPosition;
    }

    public void setGeneralPosition(String generalPosition) {
        this.generalPosition = generalPosition;
    }

    public String getExpectedPlatform() {
        return expectedPlatform;
    }

    public void setExpectedPlatform(String expectedPlatform) {
        this.expectedPlatform = expectedPlatform;
    }

    public String getRushStatus() {
        return rushStatus;
    }

    public void setRushStatus(String rushStatus) {
        this.rushStatus = rushStatus;

    }

    public double getStarRating() {
        return starRating;

    }

    public void setStarRating(double starRating) {
        this.starRating = starRating;
    }


}
