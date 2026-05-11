package com.arnav.attendanceapp.semester.controller;

import com.arnav.attendanceapp.semester.entity.Semester;
import com.arnav.attendanceapp.semester.service.SemesterService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/semesters")
public class SemesterController {

    private final SemesterService semesterService;

    public SemesterController(SemesterService semesterService) {
        this.semesterService = semesterService;
    }

    @PostMapping
    public Semester createSemester(@RequestBody Semester semester) {
        return semesterService.createSemester(semester);
    }

}
