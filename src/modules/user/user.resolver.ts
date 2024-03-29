import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserInput, LoginResponse, UpdateUserInput } from './user.entity';
import { ApolloError } from 'apollo-server-core';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  async hello() {
    return 'world';
  }
	@Query(() => User)
	me(@Context('currentUser') currentUser: User) {
		return currentUser
	}
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }
  @Query(() => [User])
  async customers(@Args('inputSearch') inputSearch: string) {
    return this.userService.findCustomers(inputSearch);
  }
  @Query(() => [User])
  async employees(@Args('inputSearch') inputSearch: string) {
    return this.userService.findEmployees(inputSearch);
  }
	@Query(() => User)
	async user(@Args('_id') _id: string) {
		try {
			const message = 'Not Found: User'
			const code = '404'
			const additionalProperties = {}

			const user = await this.userService.findById(_id)

			if (!user) {
				throw new ApolloError(message, code, additionalProperties)
			}

			return user
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

  @Mutation(() => User)
  async createUser(@Args('input') input: UserInput) {
    return await this.userService.create(input);
  }
  @Mutation(() => User)
  async lockUSer(@Args('_id') _id: string) {
    return await this.userService.lockUser(_id);
  }
  @Mutation(() => User)
  async lockUSerAcc(@Args('_id') _id: string) {
    return await this.userService.lockUserAcc(_id);
  }
  @Mutation(() => User)
  async updateUser(@Args('_id') _id: string, @Args('input') input: UpdateUserInput) {
    return await this.userService.updateUser(_id, input);
  }
  @Mutation(() => User)
  async updatePasword(@Args('_id') _id: string, @Args('oldPass') oldPass: string, @Args('newPass') newPass: string) {
    return await this.userService.updatePass(_id, oldPass, newPass);
  }
  @Mutation(() => Boolean)
  async deleteUser(@Args('_id') _id: string) {
    return await this.userService.deleteOne(_id);
  }

  @Mutation(() => Boolean)
  async deleteAll() {
    return await this.userService.deleteAll();
  }
  @Mutation(() => LoginResponse)
  async login(@Args('input') input: UserInput) {
    return await this.userService.login(input);
  }
  @Mutation(() => Boolean)
  async setRole(@Args('_id') _id: string, @Args('code') code: string) {
    return await this.userService.setRole(_id, code)
  }
  @Mutation(() => Boolean)
  async updateUrlImg(@Args('_id') _id: string, @Args('urlImg') urlImg: string) {
    return await this.userService.setUrlImg(_id, urlImg)
  }

}