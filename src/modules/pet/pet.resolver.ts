import {
	Resolver,
	Query,
	Args,
	Mutation,
} from '@nestjs/graphql'
import { MongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'
import { InjectRepository } from '@nestjs/typeorm'
import {Pet, PetInput} from './pet.entity'
@Resolver('pet')
export class PetResolver {
  constructor (
    @InjectRepository(Pet)
    private readonly petRepository: MongoRepository<Pet>
  ) {}
  
  @Query('pets')
  async pets() {
    return this.petRepository.find()
  }

  @Query('pet')
  async pet(@Args('_id') _id: string): Promise<Pet> {
    try {
			const message = 'Not Found: Pet'
			const code = '404'
			const additionalProperties = {}

			const pet = await this.petRepository.findOne({_id})

			if (!pet) {
				throw new ApolloError(message, code, additionalProperties)
			}

			return pet
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
  }
  @Query('petByOwner')
  async petByOwner(@Args('owner') owner: string) {
    return this.petRepository.find({owner})
  }

  @Mutation('createPet')
  async createPet(@Args('input') input: PetInput): Promise<Pet> {
    const {name, age, breed, gender, health, owner, species} = input
    const pet = new Pet()
    pet.name = name
    pet.age = age
    pet.breed = breed
    pet.gender = gender
    pet.health = health
    pet.owner = owner
    pet.species = species
    console.log(pet)
    return await this.petRepository.save(pet)
  }

  @Mutation('deletePet')
  async deletePet(@Args('_id') _id: string): Promise<Boolean> {
    try {
			const message = 'Not Found: Pet'
			const code = '404'
			const additionalProperties = {}

			const pet = await this.petRepository.findOne({_id})

			if (!pet) {
				throw new ApolloError(message, code, additionalProperties)
			}
      pet.isActive = false
      return (await this.petRepository.save(pet)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
  }
  @Mutation('updatePet')
  async updatePet(@Args('_id') _id: string, @Args('input') input: PetInput): Promise<Boolean> {
    try {
			const message = 'Not Found: Pet'
			const code = '404'
			const additionalProperties = {}

			const pet = await this.petRepository.findOne({_id})

			if (!pet) {
				throw new ApolloError(message, code, additionalProperties)
			}
      const {name, age, breed, gender, health, owner, species} = input
      pet.name = name
      pet.age = age
      pet.breed = breed
      pet.gender = gender
      pet.health = health
      pet.owner = owner
      pet.species = species
      return await this.petRepository.save(pet) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
  }

}
