package com.arnav.attendanceapp.calendar.service;

import com.arnav.attendanceapp.calendar.entity.CalendarDay;
import com.arnav.attendanceapp.calendar.entity.DayType;
import com.arnav.attendanceapp.calendar.repo.CalendarDayRepo;
import com.arnav.attendanceapp.semester.entity.Semester;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CalendarDayService {

    private final CalendarDayRepo calendarDayRepo;


    public CalendarDayService(CalendarDayRepo calendarDayRepo) {
        this.calendarDayRepo = calendarDayRepo;
    }

    public List<CalendarDay> generateSemesterCalendar(Semester semester) {
        LocalDate startDate = semester.getStartDate();
        LocalDate endDate = semester.getEndDate();

        List<CalendarDay> calendarDays = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            CalendarDay calendarDay = new CalendarDay();
            calendarDay.setDate(date);
            calendarDay.setSemester(semester);
            if (date.getDayOfWeek().getValue() >= 6) { // Saturday and Sunday
                calendarDay.setDayType(DayType.WEEKEND_DAY);
            } else {
                calendarDay.setDayType(DayType.WORKING_DAY);
            }
            calendarDays.add(calendarDay);
        }

        calendarDays = calendarDayRepo.saveAll(calendarDays);
        return calendarDays;
    }

    public List<CalendarDay> getSemesterCalendar(String semesterId) {
        return calendarDayRepo.findBySemesterId(Long.parseLong(semesterId));
    }

}
