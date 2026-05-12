package com.arnav.attendanceapp.calendar.controller;

import com.arnav.attendanceapp.calendar.entity.CalendarDay;
import com.arnav.attendanceapp.calendar.service.CalendarDayService;
import com.arnav.attendanceapp.semester.entity.Semester;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarDayController {

    private final CalendarDayService calendarDayService;
    public CalendarDayController(CalendarDayService calendarDayService) {
        this.calendarDayService = calendarDayService;
    }

    @GetMapping("/semester/{semesterId}")
    public List<CalendarDay> getSemesterCalendar(@PathVariable String semesterId) {
        return calendarDayService.getSemesterCalendar(semesterId);
    }

}
