package com.example.BharatRail.Repository;

import com.example.BharatRail.Controller.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TrainRepository extends JpaRepository<Train, Long> {


    @Query("SELECT t FROM Train t WHERE t.trainNumber LIKE %:query% OR t.trainName LIKE %:query%")
    List<Train> searchTrains(@Param("query") String query);

    Train findByTrainNumber(String trainNumber);
}
