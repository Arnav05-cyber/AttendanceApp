import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DayType } from './day-type.enum';
import { Semester } from '../semester/semester.entity';

@Entity('calendar_days')
export class CalendarDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ name: 'day_type', type: 'enum', enum: DayType, nullable: false })
  dayType: DayType;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Semester, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;
}
