package com.arnav.attendanceapp.semester.repo;

import com.arnav.attendanceapp.calendar.entity.CalendarDay;
import com.arnav.attendanceapp.semester.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface SemesterRepo extends JpaRepository<Semester,Long> {


}
