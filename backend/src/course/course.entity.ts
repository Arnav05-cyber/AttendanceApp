import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Semester } from '../semester/semester.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'lectures_per_week', nullable: true, default: 0 })
  lecturesPerWeek: number;

  @Column({ name: 'tutorials_per_week', nullable: true, default: 0 })
  tutorialsPerWeek: number;

  @Column({ name: 'labs_per_week', nullable: true, default: 0 })
  labsPerWeek: number;

  @Column({ name: 'minimum_attendance', type: 'float', default: 75.0 })
  minimumAttendance: number;

  @ManyToOne(() => Semester, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;
}
