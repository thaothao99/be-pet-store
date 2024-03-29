import { Entity, Column, ObjectIdColumn, BeforeInsert } from 'typeorm';
import * as uuid from 'uuid';
import {
	IsString,
	IsNotEmpty,
  IsBoolean,
	IsInt,
} from 'class-validator'
export class PetInput {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsInt()
	@IsNotEmpty()
	age: string
  
  @IsString()
	@IsNotEmpty()
  gender: string

	@IsString()
	@IsNotEmpty()
  species: string

	@IsString()
	@IsNotEmpty()
  breed: string

	@IsString()
	@IsNotEmpty()
  owner: string

  @IsString()
	@IsNotEmpty()
	health: string
	
	@IsString()
	@IsNotEmpty()
  urlImg: string
}
export class UpdatePetInput {

	@IsInt()
	@IsNotEmpty()
	age: string
  
  @IsString()
	@IsNotEmpty()
	health: string
	
	@IsString()
	@IsNotEmpty()
  urlImg: string
}

@Entity()
export class Pet {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	name: string

	@Column()
	@IsInt()
	@IsNotEmpty()
	age: string
	
	@Column()
  @IsString()
	@IsNotEmpty()
  gender: string
	
	@Column()
	@IsString()
	@IsNotEmpty()
  species: string

	@Column()
	@IsString()
	@IsNotEmpty()
  breed: string

	@Column()
	@IsString()
	@IsNotEmpty()
  owner: string

	@Column()
  @IsString()
	@IsNotEmpty()
  health: string
	
	@Column()
  @IsString()
	@IsNotEmpty()
	urlImg: string
	
  @Column()
	@IsBoolean()
	@IsNotEmpty()
  isActive: boolean
  
  @BeforeInsert()
  async b4register() {
    this._id = await uuid.v1()
    this.isActive = true
  }
}