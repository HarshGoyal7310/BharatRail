package com.example.BharatRail.Controller;

import com.example.BharatRail.Repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "*") // ताकि Frontend से डेटा आसानी से मिल सके
public class TrainController {


  @Autowired
    private TrainRepository trainRepository;


    @GetMapping("/suggest")
    public List<Train> getSuggestions(@RequestParam String query) {
        return trainRepository.searchTrains(query);
    }

    @GetMapping("/{number}")
    public Train getTrainDetails(@PathVariable String number) {
        return trainRepository.findByTrainNumber(number);
    }


    @PostMapping("/updateRush")
    public void updateRush(@RequestParam String number, @RequestParam String status) {
        Train train = trainRepository.findByTrainNumber(number);
        if(train != null) {
            train.setRushStatus(status);
            trainRepository.save(train);
        }


    }
    @PostMapping("/update-contribution")
    public ResponseEntity<String> updateContribution(
            @RequestParam String trainNumber,
            @RequestParam String rushStatus,
            @RequestParam Double rating) {

        Train train = trainRepository.findByTrainNumber(trainNumber);
        if (train != null) {
            train.setRushStatus(rushStatus);

            // पुरानी रेटिंग और नई रेटिंग का एवरेज निकालने का सिंपल लॉजिक
            Double currentRating = train.getStarRating();
            train.setStarRating((currentRating + rating) / 2);

            trainRepository.save(train);
            return ResponseEntity.ok("Contribution Saved!");
        }
        return ResponseEntity.status(404).body("Train not found");
    }

    // नया एन्डपॉइंट: ट्रेन का रश स्टेटस और स्टार रेटिंग अपडेट करें
    @PostMapping("/update-status")
    public ResponseEntity<String> updateStatus(@RequestParam String trainNo,
                                               @RequestParam(required = false) String rush,
                                               @RequestParam(required = false) Double stars) {
        Train train = trainRepository.findByTrainNumber(trainNo);
        if (train != null) {
            if (rush != null) {
                train.setRushStatus(rush);
            }

            // defensive: handle null incoming stars
            double incomingStars = (stars != null) ? stars : 0.0;
            double current = train.getStarRating();
            double newRating = (current + incomingStars) / 2.0;
            train.setStarRating(newRating);

            trainRepository.save(train);
            return ResponseEntity.ok("Success");
        }
        return ResponseEntity.status(404).body("Train Not Found");
    }


}
