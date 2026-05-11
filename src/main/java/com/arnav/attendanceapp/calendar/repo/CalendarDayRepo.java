package com.arnav.attendanceapp.calendar.repo;

import com.arnav.attendanceapp.calendar.entity.CalendarDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarDayRepo extends JpaRepository<CalendarDay, Long> {
}
