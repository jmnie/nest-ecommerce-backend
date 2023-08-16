import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @ApiProperty({ description: 'user for each customer', example: 'user1' })
  @Column()
  user: string

  @ApiProperty({ description: 'product', example: 'Sample Running Shoe 1' })
  product: string

  @Column({ unique: true })
  openid: string

  @Column()
  remainCount: number //Reamining count for each product

  @ApiPropertyOptional({ description: 'Product descrption', example: 'Special Product' })
  @Column()
  remark?: string

  @ApiPropertyOptional({ description: 'Order Creation Time' })
  @CreateDateColumn()
  readonly createdDate?: Date

  @ApiPropertyOptional({ description: 'Order Update time' })
  @UpdateDateColumn()
  readonly updateDate?: Date

  @Column()
  kafkaRawMessage?: string //Kafka Consuming initial message 
}
