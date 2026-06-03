import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('semesters')
export class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: string;
}
