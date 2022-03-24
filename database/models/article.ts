import { AllowNull, AutoIncrement, Column, DataType, Default, Index, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class Article extends Model implements Article {

  @PrimaryKey
  @Index
  @Column(DataType.INTEGER)
  @AutoIncrement
  id!: number;

}