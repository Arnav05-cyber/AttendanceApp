package com.arnav.attendanceapp.calendar.repo;

import com.arnav.attendanceapp.calendar.entity.CalendarDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarDayRepo extends JpaRepository<CalendarDay, Long> {

    List<CalendarDay> findBySemesterId(Long semesterId);
}
