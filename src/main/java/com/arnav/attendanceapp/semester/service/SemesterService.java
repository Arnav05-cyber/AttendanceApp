package com.arnav.attendanceapp.semester.service;


import com.arnav.attendanceapp.calendar.service.CalendarDayService;
import com.arnav.attendanceapp.semester.entity.Semester;
import com.arnav.attendanceapp.semester.repo.SemesterRepo;
import org.springframework.stereotype.Service;

@Service
public class SemesterService {

    private final SemesterRepo semesterRepo;
    private final CalendarDayService  calendarDayService;

    public SemesterService(SemesterRepo semesterRepo,  CalendarDayService calendarDayService) {
        this.semesterRepo = semesterRepo;
        this.calendarDayService = calendarDayService;
    }

    public Semester createSemester(Semester semester) {
        Semester savedSemester = semesterRepo.save(semester);
        calendarDayService.generateSemesterCalendar(savedSemester);
        return savedSemester;
    }
}
