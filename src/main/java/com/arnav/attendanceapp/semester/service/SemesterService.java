package com.arnav.attendanceapp.semester.service;


import com.arnav.attendanceapp.semester.entity.Semester;
import com.arnav.attendanceapp.semester.repo.SemesterRepo;
import org.springframework.stereotype.Service;

@Service
public class SemesterService {

    private final SemesterRepo semesterRepo;

    public SemesterService(SemesterRepo semesterRepo) {
        this.semesterRepo = semesterRepo;
    }

    public Semester createSemester(Semester semester) {
        return semesterRepo.save(semester);
    }
}
