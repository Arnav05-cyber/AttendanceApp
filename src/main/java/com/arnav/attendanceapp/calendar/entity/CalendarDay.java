package com.arnav.attendanceapp.calendar.entity;

import com.arnav.attendanceapp.semester.entity.Semester;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "calendar_days")
public class CalendarDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @NotNull
    private DayType dayType;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;
}
