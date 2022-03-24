import { AllowNull, AutoIncrement, Column, DataType, Default, Index, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class Sale extends Model implements Sale {

  @PrimaryKey
  @Index
  @Column(DataType.INTEGER)
  @AutoIncrement
  id!: number;

}